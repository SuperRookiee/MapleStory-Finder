import Image from "next/image";

interface IWorldNameProps {
    name: string;
    size?: number;
}

const WorldIcon = ({ name, size = 20 }: IWorldNameProps) => {
    const icon = worldIconMap[name];
    if (!icon) return null;

    return (
        <Image
            src={icon}
            alt={name}
            width={size}
            height={size}
        />
    );
};

const worldIconMap: Record<string, string> = {
    "전체월드": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_1.png",
    "핼리오스": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_2.png",
    "에오스": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_3.png",
    "오로라": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_4.png",
    "레드": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_5.png",
    "이노시스": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_6.png",
    "유니온": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_7.png",
    "스카니아": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_8.png",
    "루나": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_9.png",
    "제니스": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_10.png",
    "크로아": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_11.png",
    "베라": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_12.png",
    "엘리시움": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_13.png",
    "아케인": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_14.png",
    "노바": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_15.png",
    "챌린저스": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_20.png",
    "챌린저스2": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_21.png",
    "챌린저스3": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_22.png",
    "챌린저스4": "https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_23.png",
};

export default WorldIcon;
