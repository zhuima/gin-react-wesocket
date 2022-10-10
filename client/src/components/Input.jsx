import React, { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import "./index.css";

const Input = () => {
  const [command, setCommand] = useState();
  const [result, setResult] = useState([]);
  const inputRef = useRef(null);
  const conn = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

    ws.onopen = () => {
      console.log("Connected to websocket");
    };

    // https://www.kianmusser.com/articles/react-where-put-websocket/
    // 参考文档解决 https://amateur-engineer.com/react-usestate-object-update/
    ws.onmessage = (event) => {
      // 追加信息到数组
      setResult((prevState) => {
        const arr = [...prevState];
        var messages = event.data.split("\n");
        for (var i = 0; i < messages.length; i++) {
          arr.push(messages[i]);
        }
        return arr;
      });
    };

    ws.onclose = () => {
      console.log("Connected Closed!");
    };
    ws.onerror = () => {
      console.log("WS error");
    };

    conn.current = ws;
    return () => {
      ws.close();
    };
  }, []);

  // 提交按钮
  const handleSubmit = (event) => {
    // 防止提交的浏览器刷新操作
    event.preventDefault();
    // 发送信息给ws
    conn.current.send(command);

    // 清空输入框
    // https://bobbyhadz.com/blog/react-clear-input-value
    inputRef.current.value = null;
  };

  // 输入框改变的操作
  const handleOnChange = (event) => {
    setCommand(event.target.value);
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row className="align-items-center">
          <Col xs={6} md={6}>
            <Form.Control
              ref={inputRef}
              required
              size="lg"
              type="text"
              id="input_command"
              name="input_command"
              onChange={handleOnChange}
              placeholder="Please Enter Execute Command"
            />
          </Col>
          <Col xs="auto">
            <Button type="submit">Submit</Button>
          </Col>
        </Row>
      </Form>

      {result.length > 0 ? (
        <div className="terminal-card">
          <Card
            bg="dark"
            key="Dark"
            text={"dark" === "light" ? "dark" : "success"}
            style={{ width: "950px" }}
          >
            <Card.Header>{command} 执行结果如下</Card.Header>
            <Card.Body>
              {result.map((msg, index) => (
                <p key={index}>{msg}</p>
              ))}
            </Card.Body>
          </Card>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Input;
