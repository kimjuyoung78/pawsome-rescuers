import React from 'react';
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import Paw from "../assets/images/Paw_blue.svg";

interface KakaoMapProps {
    center?: {
        lat: number;
        lng: number;
    };
    style?: React.CSSProperties;
    level?: number;
}

const KakaoMap: React.FC<KakaoMapProps> = ({
    center = { lat: 33.450701, lng: 126.570667 },
    style = { width: '90%', height: '100px' },
    level = 3
    }) => {
    const [loading, error] = useKakaoLoader({
        appkey: "8302895b0ba8071839167bc1c09e5416",
    });

    if (loading || error) return null;

    return (
        <Map
        center={center}
        style={style}
        level={level}
        >
            <MapMarker
                position={center}
                image={{
                    src:Paw,
                    size:{
                        width : 50,
                        height: 70
                    },
                }}
            />
        </Map>
    );
}
export default KakaoMap;