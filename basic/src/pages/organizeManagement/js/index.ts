import { customRef } from 'vue' 

/**
 * @description 延迟输入的自定义ref
 * @param {*} value  绑定的值 
 * @param {*} delay 延迟时间
 */
export default function debounceRef(value:any,delay = 100) { 
    let timer:any = null
    return customRef((track,trigger)=>{
        return {    
            get (){
                track()
                return value
            },
            set(newValue){
                clearTimeout(timer)
                timer = setTimeout(() => {
                    value = newValue
                    trigger()
                }, delay);
            }
        }
    })
 }