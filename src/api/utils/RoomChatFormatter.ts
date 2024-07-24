
const allowedColours: Map<string, string> = new Map();

allowedColours.set('r', 'red');
allowedColours.set('b', 'blue');
allowedColours.set('g', 'green');
allowedColours.set('y', 'yellow');
allowedColours.set('w', 'white');
allowedColours.set('o', 'orange');
allowedColours.set('c', 'cyan');
allowedColours.set('br', 'brown');
allowedColours.set('pr', 'purple');
allowedColours.set('pk', 'pink');

allowedColours.set('red', 'red');
allowedColours.set('blue', 'blue');
allowedColours.set('green', 'green');
allowedColours.set('yellow', 'yellow');
allowedColours.set('white', 'white');
allowedColours.set('orange', 'orange');
allowedColours.set('cyan', 'cyan');
allowedColours.set('brown', 'brown');
allowedColours.set('purple', 'purple');
allowedColours.set('pink', 'pink');

const encodeHTML = (str: string) =>
{
    return str.replace(/([\u00A0-\u9999<>&])(.|$)/g, (full, char, next) =>
    {
        if(char !== '&' || next !== '#')
        {
            if(/[\u00A0-\u9999<>&]/.test(next)) next = '&#' + next.charCodeAt(0) + ';';

            return '&#' + char.charCodeAt(0) + ';' + next;
        }

        return full;
    });
}

export const RoomChatFormatter = (content: string, styleId: number) =>
{
    let result = '';

    /*const styles = [1, 2, 33, 34];
    if(!styles.includes(styleId)){
        content = encodeHTML(content)
        content = (joypixels.shortnameToUnicode(content) as string)
    }*/

    if (content.toLowerCase().includes("onerror="))
        content = "Soy estúpido y no se realizar un XSS.";
    if (content.toLowerCase().includes("javascript:"))
        content = "Soy estúpido y no se realizar un XSS.";
    if (content.toLowerCase().includes("onmouseover="))
        content = "Soy estúpido y no se realizar un XSS.";
    if (content.toLowerCase().includes("<audio") && content.toLowerCase().includes("<img"))
        content = "Soy estúpido y no se realizar un XSS.";
    if (content.toLowerCase().includes("<audio") && content.toLowerCase().includes("<h"))
        content = "Soy estúpido y no se realizar un XSS.";
    if (content.toLowerCase().includes("<script"))
        content = "Soy estúpido y no se realizar un XSS.";

    if(content.includes("giphy.com/media")){
        if(content.includes("@")){
            content = "<img src='" + content.split("@")[2] + ".gif' style='max-width: 150px; object-fit: contain;'/>";
        }
        else content = "<img src='" + content + ".gif' style='max-width: 150px; object-fit: contain;'/>";
    }

    if(content.includes("https://int.kubbo.city/audios/")){
        if(content.includes("@")){
            content = "<audio style='height: 20px; position: relative; top: 3px;' controls src='" + content.split("@")[2] + "'/>";
        }
        else content = "<audio style='height: 20px; position: relative; top: 3px;' controls src='" + content + "'/>";
    }

    if(content.startsWith('@') && content.indexOf('@', 1) > -1)
    {
        let match = null;

        while((match = /@[a-zA-Z]+@/g.exec(content)) !== null)
        {
            const colorTag = match[0].toString();
            const colorName = colorTag.substr(1, colorTag.length - 2);
            const text = content.replace(colorTag, '');

            if(!allowedColours.has(colorName))
            {
                result = text;
            }
            else
            {
                const color = allowedColours.get(colorName);
                result = '<span style="color: ' + color + '">' + text + '</span>';
            }
            break;
        }
    }
    else
    {
        result = content;
    }

    return result;
}
