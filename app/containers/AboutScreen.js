import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import RNLanguages from "react-native-languages";

import i18n from "../internationalization/i18n";

import Config from "../config";

import { View, Text, Image } from "react-native";

import { AppScreen, MenuButtonContainer, Button } from "../components";

import { navigateWelcome, uploadLogs } from "../actions";

import { textStyle, title, subtitle, cardWrapper, cardStyle } from "../styles";

// const textStyle = {
//   textAlign: "center",
//   paddingLeft: 20,
//   paddingRight: 20,
//   fontSize: 15
// };
//
// const title = {
//   fontSize: 30,
//   fontWeight: "bold",
//   color: "#1B80C9",
//   paddingTop: 30,
//   paddingLeft: 20
// };
// const subtitle = {
//   fontSize: 18,
//   color: "#1B80C9",
//   paddingBottom: 10,
//   fontWeight: "bold",
//   textAlign: "center"
// };
//
// const cardWrapper = {
//   alignItems: "center",
//   paddingTop: 15,
//   boxShadow: "10px 10px grey"
// };
// const cardStyle = {
//   backgroundColor: "white",
//   width: "90%",
//   padding: 18,
//   borderRadius: 10,
//   elevation: 7
// };

// class Card extends React.Component {
//   render() {
//     return (
//       <View
//         style={{
//           alignItems: "center",
//           paddingTop: 30
//         }}
//       >
//         <View style={cardStyle}>
//           <Image
//             source={require("../../assets/FieldkitAbout.jpg")}
//             style={{
//               resizeMode: "contain",
//               width: "100%",
//               height: 200
//             }}
//           />
//           <Text style={textStyle}>
//             Use Fieldkit's low-cost, reliable sensors and compatible tools to
//             tell compelling stories with data.
//           </Text>
//           <View style={{ alignItems: "center" }}>
//             <Button title="Upload Logs" onPress={() => uploadLogs()} />
//           </View>
//         </View>
//       </View>
//     );
//   }
// }

class AboutScreen extends React.Component {
    static navigationOptions = { header: null };

    render() {
        const { navigateWelcome } = this.props;
        return (
            <AppScreen>
                <View style={{ height: "92%" }}>
                    <Text style={title}>About</Text>
                    <View style={cardWrapper}>
                        <View style={cardStyle}>
                            <Image
                                source={require("../../assets/FieldkitAbout.jpg")}
                                style={{
                                    resizeMode: "contain",
                                    width: "100%",
                                    height: 200
                                }}
                            />
                            <Text style={textStyle}>Use Fieldkit's low-cost, reliable sensors and compatible tools to tell compelling stories with data.</Text>
                        </View>
                    </View>
                    <View style={cardWrapper}>
                        <View style={cardStyle}>
                            <Text style={subtitle}>Tell us about any errors</Text>
                            <View style={{ alignItems: "center" }}>
                                <Button title="Upload Logs" onPress={() => uploadLogs()} />
                            </View>
                        </View>
                    </View>
                </View>
            </AppScreen>
        );
    }
}

AboutScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});

export default connect(
    mapStateToProps,
    {
        navigateWelcome,
        uploadLogs
    }
)(AboutScreen);
