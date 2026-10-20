import * as dotenv from 'dotenv'

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export async function searchMovie(title){
    const params = new URLSearchParams({
        query: title,
        api_key: TMDB_API_KEY,
    })

    const url = `${TMDB_BASE_URL}/search/movie?${params}`
    
    const response = await fetch(url)
    const data = await response.json();

    if(data.results.length === 0){
        return undefined
    }
    return data.results[0];
}