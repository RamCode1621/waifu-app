import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export enum WaifuCategoryTypeSFW {
    WAIFU = 'waifu',
    NEKO = 'neko',
    SHINOBU = 'shinobu',
    CRY = 'cry',
    KISS = 'kiss',
    HUG = 'hug',
    PAT = 'pat',
    SMUG = 'smug',
    BONK = 'bonk',
    YEET = 'yeet',
    BLUSH = 'blush',
    SMILE = 'smile',
    WAVE = 'wave',
    HIGHFIVE = 'highfive',
    HANDHOLD = 'handhold',
    NOM = 'nom',
    BITE = 'bite',
    SLAP = 'slap',
    HAP = 'happy',
    WINK = 'wink',
    POKE = 'poke',
    DANCE = 'dance',
    CRINGE = 'cringe',
}

export enum WaifuCategoryTypeNSFW {
    WAIFU = 'waifu',
    NEKO = 'neko',
    TRAP = 'trap',
    BLOWJOB = 'blowjob'
}

export enum WaifuType {
    SFW = 'sfw',
    NSFW = 'nsfw'
}

export default function useWaifuService() {
    const baseUri = 'https://api.waifu.pics'
    const [waifusList, setWaifusList] = useState([])
    const [waifuUnique, setWaifuUnique] = useState(String)
    const [randomWaifu, setRandomWaifu] = useState(String)

    const {type,category} = useParams()

    useEffect(()=>{
        if(waifusList.length===0){
            getWaifus(
                {
                    unique:false
                }
            )
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[waifusList]) 

    const buildUri = ({
        many, 
        type,
        category
    }: {
        many: boolean,
        type: string,
        category: string
    }): string => {
        return `${baseUri}${many ? '/many' : ''}/${type}/${category}`
    }

    const buildQuery = async ({
        url,
        method,
    }: {
        url: string,
        method: 'get' | 'post',
    }): Promise<any> => {
        let response
        if (method === 'get') {
            response = await axios.get(url)
        } else if (method === 'post') {
            response = await axios.post(url, {
                files: []
            })
        }
        return response
    } 

    const getWaifus = async ({unique}: {unique: boolean}): Promise<void> => {
        let uri: string
        let response: any

        let typeContent=type?(type):('sfw')
        let categoryContent=category?(category):('waifu')

        try {
            if (!unique) {
                uri = buildUri({
                    many: true,
                    type:typeContent,
                    category:categoryContent
                })
                response = await buildQuery({
                    url: uri,
                    method: 'post'
                })
                setWaifusList(response.data.files)
            } else {
                uri = buildUri({
                    many: false,
                    type:typeContent,
                    category:categoryContent
                })
                response = await buildQuery({
                    url: uri,
                    method: 'get'
                })
                setWaifuUnique(response.data.url)
            }

        } catch (error) {
            throw new Error('Error getting waifus')
        }
    }

    const getRandomWaifu = async (): Promise<void> => {
        let type = Object.values(WaifuType)[Math.floor(Math.random() * Object.values(WaifuType).length)]
        let category: string

        if (type === WaifuType.SFW) {
            category = Object.values(WaifuCategoryTypeSFW)[Math.floor(Math.random() * Object.values(WaifuCategoryTypeSFW).length)]
        } else {
            category = Object.values(WaifuCategoryTypeNSFW)[Math.floor(Math.random() * Object.values(WaifuCategoryTypeNSFW).length)]
        }

        try {
            const uri = buildUri({
                many: false,
                type,
                category
            })
            const response = await buildQuery({
                url: uri,
                method: 'get'
            })

            setRandomWaifu(response.data.url)
        } catch (error) {
            throw new Error('Error getting random waifu')
        }
    }

    return {
        waifusList,
        waifuUnique,
        randomWaifu,
        getWaifus,
        getRandomWaifu
    }
}