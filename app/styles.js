const colors = {
    defaultBackground: "#efefef",
    secondaryButton: 'darkblue',
};

export const Colors = colors;

export default appStyle = {
    mainView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.defaultBackground,
    },
    menuButton: {
        fontSize: 30,
    },
    menuButtonContainer: {
        flexDirection: 'column',
        alignContent: 'center',
        padding: 20,
    },
    menuButton: {
        height: 75
    },
    connecting: {
        cancel: {
        },
        status: {
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            fontSize: 25,
            textAlign: 'center',
            padding: 20,
        }
    },
    deviceInfo: {
        container: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
        },
        name: {
            paddingLeft: 20,
            paddingRight: 20,
            fontWeight: "bold",
            fontSize: 30,
        },
        lineTwo: {
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 10,
            flexDirection: 'row',
        },
        address: {
            fontSize: 14,
            flex: 2,
        },
        battery: {
            flex: 1,
            textAlign: "right",
            fontSize: 14,
        }
    },
    sensor: {
        container: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            paddingLeft: 20,
        },
        name: {
            paddingBottom: 6,
            fontSize: 20
        },
        frequency: {
        },
        unitOfMeasure: {
        }
    },
    loading: {
        alignItems: 'center',
        fontSize: 25,
        textAlign: 'center',
        height: 80,
        padding: 20,
    },
    device: {
        container: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            flexDirection: 'row',
            paddingLeft: 20,
            paddingBottom: 10,
        },
        name: {
            fontSize: 25,
            fontWeight: "bold"
        },
        details: {
            fontSize: 20,
        }
    },
    dataSet: {
        container: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            paddingLeft: 20,
            paddingBottom: 10,
        },
        name: {
            fontSize: 25,
            fontWeight: "bold"
        },
        details: {

        }
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
            backgroundColor: 'rgba(0, 0, 0, 0)',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between'
        },
        chart: {
            container: {
                width: '100%',
                backgroundColor: '#fff',
                borderTopWidth: 1,
                borderColor: '#000'
            }
        },
        legend: {
            container: {
                height: 40,
                padding: 5,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
            },
            dotStyle: {
                width: 30,
                height: 30,
                borderRadius: 30/2
            },
            sensor: {
                name: {
                    paddingLeft: 5,
                    fontSize: 20,
                    fontWeight: "bold"
                },
                value: {
                    fontSize: 20,
                },
            },
        },
    },
    networks: {
        container: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 10,
        },
        heading: {
            fontSize: 24,
            fontWeight: "bold"
        },
        network: {
            editing: {
                container: {
                },
                ssid: {
                    backgroundColor: 'white',
                    height: 40,
                    marginBottom: 10,
                    borderColor: 'gray',
                    borderWidth: 1,
                },
                password: {
                    backgroundColor: 'white',
                    height: 40,
                    marginBottom: 10,
                    borderColor: 'gray',
                    borderWidth: 1,
                },
            },
            viewing: {
                container: {
                    flexDirection: 'row',
                },
                ssid: {
                    fontSize: 20,
                },
                password: {
                    fontSize: 20,
                },
            },
        },
    },
};
