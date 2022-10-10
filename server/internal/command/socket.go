package command

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// We'll need to define an Upgrader
// this will require a Read and Writer

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,

	// We'll need to check the origin of our connection
	// this will allow us to make requests from our react
	// development server to here.
	// For now. we'll do no checking and just allow any connection
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func Upgrade(c *gin.Context) (*websocket.Conn, error) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return conn, nil
}
