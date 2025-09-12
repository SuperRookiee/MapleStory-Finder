import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";

const trimImage = async (req: NextApiRequest, res: NextApiResponse) => {
    const url = req.query.url as string;
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());

    const output = await sharp(buffer)
        .trim() // 투명 여백 제거
        .png()
        .toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.send(output);
}

export default trimImage;
