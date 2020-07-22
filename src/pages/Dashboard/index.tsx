import React, { useState, useEffect, FormEvent } from 'react';
import { Title, Form, Repositories, Error } from '../Dashboard/styles'
import Logo from '../../assets/name.svg'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import api from '../../services/api'


interface Repository {
  full_name: string;
  description: string
  owner: {
    login: string;
    avatar_url: string;
  }
}
const Dashboard: React.FC = () => {
  const [inputError, setInputError] = useState('');
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const strogeRepositories = localStorage.getItem('@GithubExplorer:repositories')
    if (strogeRepositories) {
      return JSON.parse(strogeRepositories);
    } else {
      return [];
    }
  });



  useEffect(() => {
    localStorage.setItem('@GithubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);
  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError("Digite o autor/nome do repositório")
      return
    }
    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);
      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('')
    } catch (err) {
      setInputError("Erro na busca por esse repositório")
    }
    //Addição de um novo repo
    //consumir API do Git

  }
  return (
    <>
      <img src={Logo} alt="Github Explorer" />
      <Title> Explore repositórios no Github</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input value={newRepo}
          onChange={(e): void => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório" />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map(repository => (
          <Link key={repository.full_name}
            to={`/repository/${repository.full_name}`}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.owner.avatar_url}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>


        ))}
      </Repositories>
    </>
  )
}

export default Dashboard;