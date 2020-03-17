enum bgColor {
    //% block="白"
    White,
    //% block="黒"
    Black,
    //% block="赤"
    Red,
    //% block="緑"
    Green,
    //% block="青"
    Blue,
    //% block="黄色"
    Yellow,
    //% block="水色"
    Aquq,
    //% block="紫"
    Puple
}

//% weight=100 color=#0fbc11
namespace Grove16x2LCD {
    function lcdWriteRegister(addr: number, val: number): void {
        let LCD_ADDR = 0x3e;
        let cmd: Buffer = pins.createBuffer(2);
        cmd.setNumber(NumberFormat.Int8LE, 0, addr);
        cmd.setNumber(NumberFormat.Int8LE, 1, val);
        pins.i2cWriteBuffer(LCD_ADDR, cmd);
    }

    //% blockId=lcd_init block="initialize"
    export function lcdInit(): void {
        // Wait for more than 30ms after VDD rises
        basic.pause(30);
        lcdWriteRegister(0x80, 0x20); // function set: 1-line mode
        basic.pause(1);
        lcdWriteRegister(0x80, 0x0c); // display control: display on, cursor off, blink off
        basic.pause(1);
        lcdWriteRegister(0x40, 0x41);
        lcdClearScreen();

        rgbWriteRegister(0x00, 0x00);
        rgbWriteRegister(0x08, 0xff);
        rgbWriteRegister(0x01, 0x20);
    }

    //% blockId=lcd_set_cursor
    function lcdSetCursor(row: number, col: number): void {
        let val = 0x80 | (row > 0 ? 0x40 : 0x00) | (col & 0xf);
        lcdWriteRegister(0x80, val);
    }

    //% blockId=lcd_clear_screen block="clear screen"
    export function lcdClearScreen(): void {
        lcdWriteRegister(0x80, 0x01);
        // Wait for more than 1.53ms
        basic.pause(2);
    }

    /**
     * @param str string, eg: "Hello"
     */
    //% blockId=lcd_write_text block="print|%str|row|%row|col|%col"
    export function lcdWriteText(str: string, row: number, col: number): void {
        lcdSetCursor(row, col);
        for (let index2 = 0; index2 <= str.length - 1; index2++) {
            lcdWriteRegister(0x40, str.charCodeAt(index2));
        }
    }

    function rgbWriteRegister(addr: number, val: number): void {
        let RGB_ADDR = 0x62;
        let cmd: Buffer = pins.createBuffer(2);
        cmd.setNumber(NumberFormat.Int8LE, 0, addr);
        cmd.setNumber(NumberFormat.Int8LE, 1, val);
        pins.i2cWriteBuffer(RGB_ADDR, cmd);
    }

    //% blockID=rgb_set_color_raw block="set bgcolor|R%r|G|%g|B|%b"
    export function rgbSetColorRaw(r: number, g: number, b: number): void {
        rgbWriteRegister(0x04, r & 0xff);
        rgbWriteRegister(0x03, g & 0xff);
        rgbWriteRegister(0x02, b & 0xff);
    }

    //% blockID=rgb_set_color block="set bgcolor|%color"
    export function rgbSetColor(color: bgColor): void {
        switch (color) {
            case bgColor.White:
                rgbSetColorRaw(255, 255, 255); break;
            case bgColor.Black:
                rgbSetColorRaw(0, 0, 0); break;
            case bgColor.Red:
                rgbSetColorRaw(255, 0, 0); break;
            case bgColor.Green:
                rgbSetColorRaw(0, 128, 0); break;
            case bgColor.Blue:
                rgbSetColorRaw(0, 0, 255); break;
            case bgColor.Yellow:
                rgbSetColorRaw(255, 255, 0); break;
            case bgColor.Aquq:
                rgbSetColorRaw(0, 255, 255); break;
            case bgColor.Puple:
                rgbSetColorRaw(128, 0, 128); break;
        }
    }
}
