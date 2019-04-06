//
// utils/index.js

export const getPathOf = (filePath, sufix, ar = undefined)=>{
    const _path = filePath.split("/");
    const _parts = _path[_path.length - 1].split(".");
    const _fileName = _parts[0];
    const _extension = _parts[1];
    const _device = `_${sufix}`;
    const _aspectRatio = isImage(_extension) ? getAspectRatio(ar) : "";
    const _name = `${_fileName}${_device}${_aspectRatio}.${_extension}`;
    let path = "";
    for (let i = 0; i < _path.length - 1; i++) path += `${_path[i]}/`;
    path += _name;
    return path;
};

export const getAspectRatio = (ar)=>{
    return `@${(process.browser ? ar !== undefined ? ar : Math.min(2, Math.ceil(window.devicePixelRatio)) : 1)}x`;
};

export const isImage = (ext)=>{
    return ext === "jpg" || ext === "png" || ext === "svg" || ext === "gif";
};

export const cleanPath = (path)=>{
    return path.replace(/[./_@x]/g, "").toLowerCase();
};

export const getCoverSizeFrom = (imageW, imageH, margin = 0, maxWidth = window.innerWidth, maxHeight = window.innerHeight)=>{
    let width = 0;
    let height = 0;
    const w = maxWidth + margin + 5;
    const h = maxHeight + margin + 5;
    width = w;
    height = width * imageH / imageW;
    if (height < h) {
        height = h;
        width = height * imageW / imageH;
    }
    return {
        w: Math.ceil(width),
        h: Math.ceil(height)
    };
};

export const loadAssets = (assets)=>{
    return new Promise(async(resolve)=>{
        if (!process.browser) resolve(assets);
        const _assets = [];
        let assetsLoaded = 0;
        for (const asset of assets) {
            _assets.push(await loadAsset(asset));
            assetsLoaded = assetsLoaded + 1;
            if (assetsLoaded === assets.length) resolve(_assets);
        }
    });
};

export const loadAsset = (asset)=>{
    return new Promise((resolve)=>{
        if (!process.browser) resolve(asset);
        const image = new Image();
        try {
            image.src = asset;
            image.decode()
                .then(()=>{ resolve(image); })
                .catch(()=>{ throw new Error(`Could not load/decode ${asset}.`); });
        } catch (error) {
            image.onload = ()=>{
                resolve(image);
            };
            image.src = asset;
        }
    });
};
