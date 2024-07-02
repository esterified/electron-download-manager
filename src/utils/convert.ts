export function bytesToSize(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "n/a";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  if (i == 0) return bytes + " " + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}
// reverse function to bytesToSize
export function sizeToBytes(str: string) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const size = sizes.find((a) => str.includes(a)) || sizes[0];
  const i = sizes.indexOf(size);
  const number = parseFloat(str.replace(size, "") || "0");
  return number * Math.pow(1024, i);
}

export const convertSeconds = (seconds: number) => {
  // convert seconds to month or days
  const months = seconds / 2592000;
  const days = seconds / 86400;
  const hours = seconds / 3600;
  const minutes = seconds / 60;
  return months >= 12
    ? null
    : months >= 1
      ? months.toFixed(1) + " months"
      : days >= 1
        ? days.toFixed(1) + " days"
        : hours >= 1
          ? hours.toFixed(1) + " hrs"
          : minutes >= 1
            ? minutes.toFixed(1) + " min"
            : seconds >= 1
              ? seconds.toFixed(1) + " sec"
              : "1 sec";
};
