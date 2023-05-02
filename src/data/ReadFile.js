const ReadFile = {
    async readFile() {
        const resp = await fetch("/src/assets/isbn.txt")
    
        if (!resp.ok) {
            throw new Error("Something wrong when reading from file.. " + resp.status)
        }
    
        let text = await resp.text()
    
        return text
    },
    async makeList() {
        let text = await this.readFile()
        let list = text.split("\n")
        return list
    }
}

export default ReadFile
