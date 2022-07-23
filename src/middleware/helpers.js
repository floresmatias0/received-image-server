const axios = require('axios');
const Jimp = require('jimp');
const fs = require('fs');
const sha256 = require('js-sha256').sha256;

const path = require('path');
const ciphertext = text => sha256(text).toString();

const uploads = path.join(__dirname, '../..' , process.env.IMAGES_STORAGE_PATH);

const resizeImage = (filename) => {
    Jimp.read(`${uploads}/${filename}`, (err, file) => {
        if (err) throw err;
        file
            .resize(1440, Jimp.AUTO) // resize
            .quality(100) // set JPEG quality 0 - 100
            .write(`${uploads}/${filename}_xl`); // save

        file
            .resize(992, Jimp.AUTO)
            .quality(90)
            .write(`${uploads}/${filename}_lg`);

        file
            .resize(768, Jimp.AUTO)
            .quality(70)
            .write(`${uploads}/${filename}_md`);

        file
            .resize(420, Jimp.AUTO)
            .quality(60)
            .write(`${uploads}/${filename}_sm.$`);

        file
            .resize(150, Jimp.AUTO)
            .quality(50)
            .write(`${uploads}/${filename}_thumbnail`);
        });
};

const fetchImage = async url => {
    let image = await axios.get(url, { responseType: "stream" });
    
    let filename = ciphertext(url);

    image.data
      .pipe(fs.createWriteStream(`${uploads}/${filename}`))
      .on('close', () => resizeImage(filename));

    return filename
};

module.exports = {
    resizeImage,
    fetchImage,
    ciphertext
}

