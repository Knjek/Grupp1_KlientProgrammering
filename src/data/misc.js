/**
 * Fetches a book title and author name based on an ISBN.
 * @param {String} isbn 
 * @returns an Array of two Strings: ['book title', 'author name']
 */
export async function getBookAndAuthorByISBN(isbn) {
    const resp = await fetch(`https://openlibrary.org/isbn/${isbn}.json`)

    if (!resp.ok) {
        throw new Error("Something went wrong when fetching data.")
    }

    const json = await resp.json()

    let bookAndAuthor = []

    if(json.title === undefined) {
        bookAndAuthor.push("undefined title in isbn: " + isbn)
    }else {
        bookAndAuthor.push(json.title)
    }

    // needs to do check if author olid from isbn-call doesn't work
    // this is a workaround
    let worksOLID = json.works[0].key
    let authorOLID = await getAuthorOLIDFromWorkOLID(worksOLID) //json.authors[0].author.key

    let authorName = await getAuthorNameByOLID(authorOLID)
    bookAndAuthor.push(authorName)

    return bookAndAuthor
}

/**
 * Fetches api-specific authorOLID from worksOLID
 * @param {String} worksOLID 
 * @returns authorOLID as String
 */
async function getAuthorOLIDFromWorkOLID(worksOLID) {
    const resp = await fetch(`https://openlibrary.org${worksOLID}.json`)

    if (!resp.ok) {
        throw new Error("Something went wrong when fetching data.")
    }

    const json = await resp.json()

    return json.authors[0].author.key
}

/**
 * Fetches a author name based on api-specific authorOLID
 * @param {String} authorOLID 
 * @returns Author name as String
 */
async function getAuthorNameByOLID(authorOLID) {
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

/**
 * @param {number} page number to fetch. Each page contains 100 json-objects.
 * @returns a list containing 100 lists of strings in the format: ['title', 'author']
 */
export async function getTrendingYearly(page) {
    const resp = await fetch(`https://openlibrary.org/trending/yearly.json?page=${page}`)

    if (!resp.ok) {
        throw new Error("Something went wrong when fetching data.")
    }

    const json = await resp.json()

    const listOfBooksAndAuthors = []
    for (const obj of json.works) {
        const list = []
        list.push(obj.title ?? "<unknown>")
        list.push(obj.author_name?.at(0) ?? "<unknown>")
        listOfBooksAndAuthors.push(list)
    }

    console.log('done loading')
    return listOfBooksAndAuthors
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