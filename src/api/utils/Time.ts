export const timeSince = (date: number) => {
    var seconds = Math.floor((new Date().valueOf() - new Date(date * 1000).valueOf()) / 1000);
    var interval = seconds / 31536000;
  
    if (interval > 1) return Math.floor(interval) + " años";
    interval = seconds / 2592000;

    if (interval > 1) return Math.floor(interval) + " meses";
    interval = seconds / 86400;

    if (interval > 1) return Math.floor(interval) + " dias";
    interval = seconds / 3600;

    if (interval > 1) return Math.floor(interval) + " horas";
    interval = seconds / 60;

    if (interval > 1) return Math.floor(interval) + " minutos";

    return Math.floor(seconds) + " segundos";
}
