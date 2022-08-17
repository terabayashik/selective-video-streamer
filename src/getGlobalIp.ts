export const getGlobalIp = async () => {
  // const res = await fetch("https://ifconfig.io/?format=json");
  const res = await fetch("https://api.ipify.org/?format=json");
  if (res.ok) {
    const json = await res.json();
    if (json.ip !== (null || undefined) && typeof json.ip === "string") {
      return json.ip as string;
    } else {
      throw new Error();
    }
  } else {
    throw new Error();
  }
};
