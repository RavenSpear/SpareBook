import {
    Dimensions,
    Platform,
    PixelRatio,
    StatusBar,
} from 'react-native'

export default {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    onePixel: 1 / PixelRatio.get(),
    STATUSBAR_HEIGHT: (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight),
    APPBAR_HEIGHT: (Platform.OS === 'ios' ? 44 : 56),
}