'use strict'

import parameter from "../models/Parameter.js";

async function getParameter(par) {
    const row = await parameter.findByPk(1);
    return row[par];
}

async function setParameter(par,val) {
    const row = await parameter.findByPk(1);
    row[par] = val;
    await row.save();
}

export {
    getParameter,
    setParameter
}