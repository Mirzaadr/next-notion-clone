"use server";

import ImageKit from "imagekit";

const imageKit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export const uploadFile = async ({
  file,
  fileName,
}: {
  file: File;
  fileName?: string;
  oldFileUrl?: string;
}) => {
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      const response = await imageKit.upload({
        file: buffer,
        fileName: fileName || "cover-image",
        useUniqueFileName: false,
        overwriteFile: true,
        folder: "note/cover",
      });

      const fileDetails = await imageKit.getFileDetails(response.fileId);

      return {
        success: true,
        message: "Successfully uploaded files",
        data: JSON.parse(JSON.stringify(fileDetails)),
      };
    } catch (error) {
      console.error(JSON.stringify(error));
      return {
        success: false,
        message: "An error occured during file upload. Please try again.",
        data: null,
      };
    }
  } else {
    return {
      success: false,
      message: "Please provide a correct file.",
      data: null,
    };
  }
};
