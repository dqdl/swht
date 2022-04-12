/**
 * @verification 表单验证
 */
export function verification() {
    // 账号验证
    const verificauser = (str: string) => {
        if (str != '') {
            return true
        } else {
            return '请输入正确的账号，包含手机号、企业信用代码等'
        }
    }
    // 密码验证
    const verificapwd = (str: string) => {
        if (str != '') {
            return true
        } else {
            return '请输入正确的密码'
        }
    }
    const code = (str: string) => {
        if (str != '') {
            return true
        } else {
            return '请输入验证码'
        }
    }
    // 新密码验证
    const verificanewpwd = (str: string) => {
        if (str != '') {
            return true
        } else {
            return '请正确输入修改的密码'
        }
    }
    // 密码安全性验证
    const AnalyzePasswordSecurityLevel = (password: string) => {
        // 符号正则
        var containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
        var securityLevelFlag = 0;
        if (/[A-Za-z]/.test(password)) {
            securityLevelFlag++;    //uppercase
        }
        if (/[0-9]/.test(password)) {
            securityLevelFlag++;    //digital
        }
        if (containSpecial.test(password)) {
            securityLevelFlag++;    //specialcase
        }
        return securityLevelFlag;
    }
    return { verificauser, verificapwd, AnalyzePasswordSecurityLevel, verificanewpwd, code };
}
/**
 * @dateFormat 时间戳格式化
 */
export function dateFormat(time: any, format: any) {
    const t = new Date(time)
    // 日期格式
    format = format || 'Y-m-d h:i:s'
    let year: any = t.getFullYear()
    // 由于 getMonth 返回值会比正常月份小 1
    let month: any = t.getMonth() + 1
    month.toString().length < 2 && (month = `0${month}`)
    let day: any = t.getDate()
    day.toString().length < 2 && (day = `0${day}`)
    let hours: any = t.getHours()
    hours.toString().length < 2 && (hours = `0${hours}`)
    let minutes: any = t.getMinutes()
    minutes.toString().length < 2 && (minutes = `0${minutes}`)
    let seconds: any = t.getSeconds()
    seconds.toString().length < 2 && (seconds = `0${seconds}`)
    const hash: any = {
        'y': year,
        'm': month,
        'd': day,
        'h': hours,
        'i': minutes,
        's': seconds
    }
    // 是否补 0
    const isAddZero = (o: any) => {
        return /M|D|H|I|S/.test(o)
    }
    return format.replace(/\w/g, (o: any) => {
        let rt = hash[o.toLocaleLowerCase()]
        // return rt > 10 || !isAddZero(o) ? rt : `0${rt}`
        return rt > 10 ? rt : `${rt}`
    })
}
