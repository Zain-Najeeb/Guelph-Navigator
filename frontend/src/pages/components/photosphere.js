import React, { useEffect, useState } from "react";
import { AWSinstance } from "../connections.js";
const awsImage = () => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    AWSinstance.then((instance) => {
      const params = {
        Bucket: "guelph-navigator-images",
        Key: "LangWay1.jpg",
      };

      instance.getObject(params, (err, data) => {
        if (err) {
          console.error('Error', err);
        } else {
          const base64Image = Buffer.from(data.Body).toString("base64");
          const imageUrl = `data:image/jpeg;base64,${base64Image}`;
          setImageSrc(imageUrl);
        }
      });
    });
  }, []); 
  return (
    <div>
      {imageSrc && <img src={imageSrc} alt="JPG Image" />}
    </div>
  );
};

export default awsImage;
