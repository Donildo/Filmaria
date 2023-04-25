import { useEffect,useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import './filmaria.styles.css';
import api from '../services/api';
import { toast } from 'react-toastify'

function Filmaria(){
    const { id } = useParams();
    const navigation = useNavigate();
    const [filme,setFilme] =useState({});
    const [loading, setLoading] =useState(true);

    useEffect(()=>{
        async function loadFilmes(){
            await api.get(`/movie/${id}`, {
                params:{
                    api_key: "9dc31aa0904499fb256069c6ecac6bef",
                    language:"pt-BR",
                }
            })
            .then((response)=>{
                setFilme(response.data);
                console.log(response.data);
                setLoading(false);

            })
            .catch(()=>{
                console.log("FILME NAO ENCONTRADO")
                Navigate("/",{ replace: true});
                return;
            })
        }

        loadFilmes();


        return() =>{
            console.log("COMPONENTE FOI DESMOTADO")
        }
    }, [Navigate, id])

    function salvarFilme(){
        const minhaLista = localStorage.getItem("@Filmaria");

        let filmesSalvos = JSON.parse(minhaLista) || [];



        const hasFilme = filmesSalvos.some( (filmesSalvo) => filmesSalvo.id === filme.id)

        if(hasFilme) {
            toast.warn("Esse filme já está salvo")
            return;
        }

        filmesSalvos.push(filme);
        localStorage.setItem("@Filmaria", JSON.stringify(filmesSalvos));
        toast.success("Filme salvo com sucesso!")
    }

    if(loading){
        return(
            <div className="filme-info">
                <h1>Carrendo detalhes.....</h1>
            </div>
        )
    }

    return(
        <div className="filme-info"> 
          <h1>{filme.title}</h1>
          <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title}/> 

          <h3>Sinopse</h3>
          <span>{filme.overview}</span>

          <strong>Avaliação: {filme.vote_average} /10</strong>


          <div className="area-buttons">
            <button onClick={salvarFilme}>Salvar</button>
            <button>
                <a target="blank" real ="external" href={`https://youtube.com/results?search_query=${filme.title} Trailer`}>
                    Trailer
                </a>
            </button>
          </div>
          
        </div>
    )
}

export default Filmaria;