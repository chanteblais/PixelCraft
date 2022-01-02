class ColourUtils {

    static getCSSColourFromRGBArray(color) {
        return 'rgb(' + color.join(', ') + ')';
    }

    static getRGBArrayFromCSSColour(colour) {
        let match = colour.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+)\s*)?\)$/i);
        if (match) {
            let array = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
            if (match[4]) {
                array.push(match[4]);
            } else {
                array.push(255);
            }
            return array;
        }
    }

    static hexToRgba(hex) {
        const r = parseInt(hex.substr(1, 2), 16)
        const g = parseInt(hex.substr(3, 2), 16)
        const b = parseInt(hex.substr(5, 2), 16)
        return [r, g, b, 255];
    }

    static rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return "#" + ("000000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);
    }

    static rgbArrayToHex(array) {
        return ColourUtils.rgbToHex(array[0], array[1], array[2])
    }
}