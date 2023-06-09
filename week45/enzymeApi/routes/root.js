'use strict'

const fs = require('fs');

module.exports = async function (fastify, opts) {
  fastify.get('/api/v3/enzyme/getcuttingsites/:seq', async function (request, reply) {

    const seq = request.params.seq.toUpperCase();

    /*if (!isValidDNA(seq)) {
      return {error: "Invalid sequence: The sequence can only contain ACTG"}
    }*/
    let maxLength = 100;
    if (seq.length > maxLength) {
      return {error: `Invalid sequence: The maximum length of the sequence is ${maxLength}`}
    }
    let result = [];

    const fileContent = fs.readFileSync('./enzymes.txt', 'utf8');
    const lines = fileContent.split('\n');
    let set;
    lines.forEach((line, index) => {
      set = false;
      if (index == 0) return;
      let parts = line.trim().split(" ");
      let miniSeq = parts[parts.length - 1].replace("^", "");
      if (seq.includes(miniSeq)) {
        console.log(parts[0])
        result.forEach(entry => {
          if (entry.enzyme === parts[0]) {
            entry.sites.push({site:miniSeq,
              locations: findSubstringPositions(seq, miniSeq)})
            set = true;
            return;
          }
        })
        if (!set) {
          result.push(
            {
              enzyme: parts[0],
              synonym: parts[1].replace("(", "").replace(")", ""),
              sites: [{site:miniSeq,
              locations: findSubstringPositions(seq, miniSeq)}]
            });
        }
      }
    })
    return reply
    .type('application/json')
    .code(200)
    .send(result);
  })
}

function isValidDNA(string) {
  const regex = new RegExp(`^[ACTG]+$`);
  return regex.test(string);
}

function findSubstringPositions(mainString, searchString) {
  const positions = [];
  let index = mainString.indexOf(searchString);
  
  while (index !== -1) {
    positions.push(index + 1);
    index = mainString.indexOf(searchString, index + 1);
  }
  
  return positions;
}
