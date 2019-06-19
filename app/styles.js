export const textStyle = {
    textAlign: "center",
    color: "#6B6D6F",
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 15
};

export const title = {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1B80C9",
    paddingTop: 30,
    paddingLeft: 20
};

export const subtitle = {
    fontSize: 18,
    color: "#1B80C9",
    paddingBottom: 10,
    fontWeight: "bold",
    textAlign: "center"
};

export const cardWrapper = {
    alignItems: "center",
    paddingTop: 15,
    boxShadow: "10px 10px grey"
};

export const cardStyle = {
    backgroundColor: "white",
    width: "90%",
    padding: 20,
    borderRadius: 10,
    elevation: 7
};

export const textPanelStyle = {
    paddingLeft: 15,
    paddingRight: 15,
    textAlign: "center"
};

const colors = {
    defaultBackground: "#F4F5F7"
};

export const Colors = colors;

export default {
    mainView: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: colors.defaultBackground
    },
    menuButton: {
        fontSize: 30
    },
    menuButtonContainer: {
        flexDirection: "column",
        alignContent: "center",
        padding: 20
    },
    menuButton: {
        height: 75
    },
    menuButton: {
        paddingBottom: 20
    },
    connecting: {
        cancel: {},
        status: {
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0)",
            fontSize: 25,
            textAlign: "center",
            padding: 20
        }
    },
    browser: {
        listing: {
            container: {},
            back: {
                container: {
                    backgroundColor: "#F7DC6F",
                    paddingTop: 10,
                    paddingLeft: 20,
                    paddingRight: 20
                },
                text: {
                    height: 40,
                    fontSize: 18,
                    color: "#6B6D6F"
                }
            },
            path: {
                container: {
                    backgroundColor: "rgba(196, 196, 196, 64)",
                    paddingTop: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingBottom: 10
                },
                text: {
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#1B80C9"
                }
            },
            entry: {
                container: {
                    paddingTop: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    backgroundColor: "ffffff"
                },
                text: {
                    fontSize: 20,
                    color: "#6B6D6F"
                }
            }
        },
        file: {
            container: {},
            name: {
                container: {
                    padding: 20
                },
                text: {
                    height: 40,
                    fontSize: 20,
                    color: "black"
                }
            },
            size: {
                container: {
                    padding: 20
                },
                text: {
                    fontSize: 14
                }
            },
            modified: {
                container: {
                    padding: 20
                },
                text: {
                    fontSize: 14
                }
            },
            filename: {
                container: {
                    padding: 20
                },
                text: {
                    fontSize: 14
                }
            }
        }
    },
    deviceInfo: {
        container: {
            backgroundColor: "rgba(196, 196, 196, 64)",
            borderBottomWidth: 1,
            borderColor: "#000",
            marginBottom: 10
        },
        name: {
            paddingLeft: 20,
            paddingRight: 20,
            fontWeight: "bold",
            fontSize: 30
        },
        lineTwo: {
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 10,
            flexDirection: "row"
        },
        address: {
            fontSize: 14,
            flex: 2
        },
        battery: {
            flex: 1,
            textAlign: "right",
            fontSize: 14
        }
    },
    sensor: {
        container: {
            backgroundColor: "rgba(0, 0, 0, 0)",
            paddingLeft: 20
        },
        name: {
            paddingBottom: 6,
            fontSize: 20
        },
        frequency: {},
        unitOfMeasure: {}
    },
    loading: {
        alignItems: "center",
        fontSize: 25,
        textAlign: "center",
        height: 80,
        padding: 20
    },
    device: {
        container: {
            backgroundColor: "rgba(0, 0, 0, 0)",
            flexDirection: "row",
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 10
        },
        name: {
            fontSize: 25,
            fontWeight: "bold"
        },
        details: {
            fontSize: 20
        }
    },
    file: {
        container: {
            backgroundColor: "rgba(0, 0, 0, 0)",
            paddingLeft: 20,
            paddingBottom: 10
        },
        name: {
            fontSize: 25,
            fontWeight: "bold"
        },
        details: {}
    },
    dataSet: {
        container: {
            backgroundColor: "rgba(0, 0, 0, 0)",
            paddingLeft: 20,
            paddingBottom: 10
        },
        name: {
            fontSize: 25,
            fontWeight: "bold"
        },
        details: {}
    },
    buttons: {
        small: {
            backgroundColor: colors.defaultBackground,
            width: 120,
            marginBottom: 10,
            marginRight: 10
        }
    },
    liveData: {
        container: {
            backgroundColor: "rgba(0, 0, 0, 0)",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between"
        },
        chart: {
            container: {
                width: "100%",
                backgroundColor: "#fff",
                borderTopWidth: 1,
                borderColor: "#000"
            }
        },
        legend: {
            container: {
                height: 40,
                padding: 5,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center"
            },
            dotStyle: {
                width: 30,
                height: 30,
                borderRadius: 30 / 2
            },
            sensor: {
                name: {
                    paddingLeft: 5,
                    fontSize: 20,
                    fontWeight: "bold"
                },
                value: {
                    fontSize: 20
                }
            }
        }
    },
    networks: {
        container: {
            backgroundColor: "rgba(0, 0, 0, 0)",
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 10
        },
        heading: {
            fontSize: 24,
            fontWeight: "bold"
        },
        network: {
            editing: {
                container: {},
                ssid: {
                    backgroundColor: "white",
                    height: 40,
                    marginBottom: 10,
                    borderColor: "gray",
                    borderWidth: 1
                },
                password: {
                    backgroundColor: "white",
                    height: 40,
                    marginBottom: 10,
                    borderColor: "gray",
                    borderWidth: 1
                }
            },
            viewing: {
                container: {
                    flexDirection: "row"
                },
                ssid: {
                    fontSize: 20
                },
                password: {
                    fontSize: 20
                }
            }
        }
    },
    dataTable: {
        container: {
            padding: 5
        },
        header: {},
        row: {
            log: {
                flexDirection: "row",
                fontSize: 10
            },
            reading: {
                flexDirection: "row",
                fontSize: 10
            },
            status: {
                flexDirection: "row",
                fontSize: 10
            },
            metadata: {
                flexDirection: "row",
                fontSize: 10
            }
        }
    }
};
