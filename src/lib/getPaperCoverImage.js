import { getPlaiceholder } from "plaiceholder";

const getImage = async (src) => {
    const buffer = await fetch(src).then(async (res) =>
        Buffer.from(await res.arrayBuffer())
    );

    const {
        metadata: { height, width },
        ...plaiceholder
    } = await getPlaiceholder(buffer, { size: 10 });

    return {
        ...plaiceholder,
        img: { src, height, width },
    };
};

export async function getPaperCoverImage(page) {
    const image = page.cover;

    if (image && image.type === "external") {
        const { base64, img: imageData } = await getImage(image.external.url);

        return {
            ...imageData,
            blurDataURL: base64,
        };
    }

    return null;
}
