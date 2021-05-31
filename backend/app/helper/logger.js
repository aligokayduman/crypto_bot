'use strict';

import fs from 'fs';

async function logger(content){

    const currentdate = new Date();
    let formatdate = currentdate.getDate() + "."
                     + currentdate.getMonth()  + "." 
                     + currentdate.getFullYear() + " "  
                     + currentdate.getHours() + ":"  
                     + currentdate.getMinutes() + ":" 
                     + currentdate.getSeconds();

    const length = formatdate.toString().length;                        
    formatdate = ( length == 18) ? formatdate+' ' : (length == 17) ? formatdate+'  ' : (length == 16) ? formatdate+'   ' : formatdate;                

    fs.appendFile('app/logs/signals.txt',formatdate+' - '+content+'\n', (err) => {
        if (err) throw err;
    });
    console.log(content);
}

export default logger;