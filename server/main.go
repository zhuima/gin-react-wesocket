package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"time"

	"server/internal/command"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

func serveWS(c *gin.Context) {
	conn, err := command.Upgrade(c)
	if err != nil {
		log.Fatalf("upgrade failed, %s", err.Error())
		return
	}

	defer conn.Close()

	outr, outw, err := os.Pipe()
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"stdout": err.Error()})
		return
	}
	defer outr.Close()
	defer outw.Close()

	inr, inw, err := os.Pipe()
	if err != nil {
		log.Println("stdin", err)
		conn.WriteMessage(websocket.TextMessage, []byte("Internal server error."))
		return
	}
	defer inr.Close()
	defer inw.Close()

	proc, err := os.StartProcess("/bin/sh", flag.Args(), &os.ProcAttr{
		Files: []*os.File{inr, outw, outw},
	})
	if err != nil {
		log.Println("start", err)
		conn.WriteMessage(websocket.TextMessage, []byte("Internal server error."))
		return
	}

	inr.Close()
	outw.Close()

	stdoutDone := make(chan struct{})
	go command.PumpStdout(conn, outr, stdoutDone)
	go command.Ping(conn, stdoutDone)

	command.PumpStdin(conn, inw)

	// Some commands will exit when stdin is closed.
	inw.Close()

	// Other commands need a bonk on the head.
	if err := proc.Signal(os.Interrupt); err != nil {
		log.Println("inter:", err)
	}

	select {
	case <-stdoutDone:
	case <-time.After(time.Second):
		// A bigger bonk on the head.
		if err := proc.Signal(os.Kill); err != nil {
			log.Println("term:", err)
		}
		<-stdoutDone
	}

	if _, err := proc.Wait(); err != nil {
		log.Println("wait:", err)
	}
}

func homePage(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

func main() {

	r := gin.Default()
	r.GET("/", homePage)
	r.GET("/ws", serveWS)
	r.Run()
}
