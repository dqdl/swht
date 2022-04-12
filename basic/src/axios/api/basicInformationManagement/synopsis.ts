/*
 * @Author: liyuan
 * @Date: 2022-01-17 10:43:24
 * @LastEditors: Liyuan
 * @LastEditTime: 2022-01-20 13:35:06
 * @FilePath: \swyqxt\basic\src\axios\api\basicInformationManagement\synopsis.ts
 */
import axios from '../../http';

let baseUrl = window.urlConfig.url;
const Synopsis = {
    //园区简介获取列表
    getSynopsis(data:any) {
        return axios.get(`${baseUrl}/uaa/park-profile/page`,{
            params:{
                ...data
            }
        });
    },
    //园区简介新增
    addSynopsis(data:any){
        return axios.post(`${baseUrl}/uaa/park-profile`, data);
    },
    //园区简介修改
    updateSynopsis(data:any){
        return axios.put(`${baseUrl}/uaa/park-profile`, data);
    },
    //园区简介删除
    delSynopsis(id:string){
        return axios.delete(`${baseUrl}/uaa/park-profile/`+id);
    },
    //园区视频获取列表
    getSynopsisVideo(data:any) {
        return axios.get(`${baseUrl}/uaa/park-video/page`,{
            params:{
                ...data
            }
        });
    },
    //园区视频新增
    addSynopsisVideo(data:any){ 
        return axios.post(`${baseUrl}/uaa/park-video`,data);
    },
    //园区视频修改
    updateSynopsisVideo(data:any){
        return axios.put(`${baseUrl}/uaa/park-video`, data);
    },
    //园区视频删除
    delSynopsisVideo(id:string){
        return axios.delete(`${baseUrl}/uaa/park-video/`+id);
    }
}

export default Synopsis;