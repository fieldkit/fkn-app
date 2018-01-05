export default appStyle = {
    mainView: {
        flex: 1,
        flexDirection: 'column',
    },
    menuButton: {
        fontSize: 30,
    },
    menuButtonContainer: {
        flex: 1,
        flexDirection: 'column',
        alignContent: 'center',
        padding: 20,
    },
    menuButton: {
        height: 75
    },
    connecting: {
        status: {
            alignItems: 'center',
            fontSize: 25,
            textAlign: 'center',
            height: 80,
            padding: 20,
        }
    },
    deviceInfo: {
        name: {
            paddingLeft: 20,
            paddingRight: 20,
            fontWeight: "bold",
            fontSize: 30,
        },
        address: {
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 10,
            fontSize: 14,
        },
    },
    sensor: {
        container: {
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
            width: 120,
            height: 40,
            paddingRight: 10
        }
    },
    liveData: {
        container: {
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
                }
            }
        },
    }
}
