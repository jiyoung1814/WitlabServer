
const StringToHexString = (str, digits) =>{
    // 자릿수(digits)에 맞게끔(빈자리는 0으로 채움) 문자열을 16진수 문자열로 변환
    let input = str;

    if(isNaN(str)){
        input = str.charCodeAt(0);
    }
    let str_h =  Number(input).toString(16).toUpperCase()
    return str_h.padStart(digits, "0");
}

const HexStringToHexByteArray = (str_h) =>{
    return Buffer.from(str_h, 'hex');
}


module.exports ={StringToHexString, HexStringToHexByteArray}