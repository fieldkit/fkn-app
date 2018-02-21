export default atlasStyles = {
    readings: {
        text: {
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20,
        }
    },
    buttons: {
        button: {
            paddingBottom: 10,
        },
        largeButton: {
            paddingBottom: 10,
        }
    },
    script: {
        buttons: {
            container: {
            },
            button: {
                paddingBottom: 10,
            }
        },
        step: {
            container: {
                padding: 20,
            },
            children: {
                container: {
                }
            },
            instructions: {
                text: {
                    fontSize: 18,
                    padding: 5,
                }
            },
            waiting: {
                remaining: {
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 30,
                }
            },
            command: {
                command: {
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 30,
                },
                failed: {
                    backgroundColor: '#ffaaaa',
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 30,
                },
                success: {
                    backgroundColor: '#aaffaa',
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 30,
                }
            }
        }
    }
};

