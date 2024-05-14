const compressVideo = (data, newSize) => {
  const newData = data;
  const resizedBuffer = data.buffer.slice(0, newSize);
  newData.size = newSize;
  newData.buffer = resizedBuffer;

  return data;
};

module.exports = compressVideo;
