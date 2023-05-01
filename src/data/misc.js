export async function getBookAndAuthorByISBN(isbn) {
    const resp = await fetch(`https://openlibrary.org/isbn/${isbn}.json`)

    if (!resp.ok) {
        throw new Error("Something went wrong when fetching data.")
    }

    const json = await resp.json()

    let bookAndAuthor = []

    bookAndAuthor.push(json.title)

    // needs to do check if author olid doesn't work
    // this is a workaround
    let worksOLID = json.works[0].key
    let authorOLID = await getWorkbyOLID(worksOLID) //json.authors[0].author.key

    let authorName = await getAuthorByOLID(authorOLID)
    bookAndAuthor.push(authorName)

    return bookAndAuthor
}

async function getWorkbyOLID(worksOLID) {
    const resp = await fetch(`https://openlibrary.org${worksOLID}.json`)

    if (!resp.ok) {
        throw new Error("Something went wrong when fetching data.")
    }

    const json = await resp.json()

    return json.authors[0].author.key
}

async function getAuthorByOLID(authorOLID) {
    const resp = await fetch(`https://openlibrary.org${authorOLID}.json`)

    if (!resp.ok) {
        throw new Error("Something went wrong when fetching data.")
    }

    const json = await resp.json()


    /* Some json doesen´t seem to have "personal_name" for the authors name, just "name".
    Therefore this if-statement */
    if (json.personal_name === undefined) {
        return json.name
    }
    else {
        return json.personal_name
    }

}

export function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }