import React, { useRef, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, BackHandler, Dimensions, StatusBar as RNStatusBar, Platform, Text, Image, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { ActivityIndicator } from 'react-native';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen'

export default function App() {
    const webViewRef = useRef()
    const [loading, setLoading] = useState(true)
    const [errorLoading, setErrorLoading] = useState(false)

    const handleBackButtonPress = () => {
        try {
            webViewRef.current?.goBack()
            return true;
        } catch (err) {
            console.log("[handleBackButtonPress] Error : ", err.message)
        }
    }

    useEffect(() => {
        const prepare = async () => {
            // keep splash screen visible
            await SplashScreen.preventAutoHideAsync()
            // pre-load your stuff
            await new Promise(resolve => setTimeout(resolve, 3000))

            // hide splash screen
            await SplashScreen.hideAsync()
        }
        prepare()

        BackHandler.addEventListener("hardwareBackPress", handleBackButtonPress)
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonPress)
        };
    }, []);

    const handleOnLoad = () => {
        setLoading(false)
        setErrorLoading(false)
    }

    return (
        <SafeAreaView style={styles.container}>
            <WebView
                onLoad={() => handleOnLoad()}
                onLoadStart={(syntheticEvent) => {
                    setLoading(true)
                }}
                onLoadEnd={(syntheticEvent) => {
                    setLoading(false)
                }}
                ref={webViewRef}
                style={styles.webViewContainer}
                source={{ uri: 'https://www.goospe.com/' }}
                onError={() => setErrorLoading(true)}
            />
            <StatusBar
                style="light"
                backgroundColor={errorLoading ? 'red' : '#2cc185'}
                translucent
            />
            {
                loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator
                            size='large'
                            color='#2cc185'
                        />
                    </View>
                ) : null
            }
            {
                errorLoading ? (
                    <View style={styles.offImageContainer}>
                        <Image
                            source={require('./assets/offline.png')}
                            style={styles.offImage}
                        />
                        <TouchableOpacity
                            style={styles.reloadButton}
                            onPress={() => webViewRef.current.reload()}
                        >
                            <Text style={{ color: '#fff' }}>Recargar</Text>
                        </TouchableOpacity>
                    </View>
                ) : null
            }


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    reloadButton: {
        position: 'absolute',
        backgroundColor: '#2cc185',
        bottom: '22%',
        zIndex: 100,
        padding: 10,
    },
    offImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    offImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 99,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 99,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#fff',
        marginTop: Platform.OS === 'ios' ? 0 : RNStatusBar.currentHeight,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    webViewContainer: {
        flex: 1,
        width: Dimensions.get('window').width,
    }
});
