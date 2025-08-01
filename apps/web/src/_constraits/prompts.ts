import {
  Sparkles,
  Code,
  BarChart3,
  MessageCircle,
  Layout,
  Zap
} from 'lucide-react'

export const predefinedPrompts = [
  {
    id: 1,
    category: 'Organização',
    icon: Layout,
    title: 'Organizar por Gênero',
    description: 'Separar músicas por gêneros musicais',
    prompt:
      'Organize minhas playlists separando as músicas por gênero musical (rock, pop, eletrônica, etc.):',
    color: 'bg-green-50 border-green-200 hover:bg-green-100'
  },
  {
    id: 2,
    category: 'Mood',
    icon: MessageCircle,
    title: 'Agrupar por Humor',
    description: 'Criar playlists baseadas no clima/humor',
    prompt:
      'Agrupe minhas músicas por humor e energia (chill, workout, study, party, relaxante):',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
  },
  {
    id: 3,
    category: 'Temporal',
    icon: BarChart3,
    title: 'Por Data de Lançamento',
    description: 'Organizar por época/década de lançamento',
    prompt:
      'Organize minhas músicas por data de lançamento, criando playlists por década ou período:',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
  },
  {
    id: 4,
    category: 'Descoberta',
    icon: Sparkles,
    title: 'Mix Favoritas + Novas',
    description: 'Combinar favoritas com descobertas',
    prompt:
      'Misture minhas músicas favoritas antigas com hits recentes e descobertas similares:',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
  },
  {
    id: 5,
    category: 'Idioma',
    icon: Code,
    title: 'Separar por Idioma',
    description: 'Dividir por idiomas das músicas',
    prompt:
      'Separe minhas músicas por idioma (português, inglês, espanhol, etc.) em playlists diferentes:',
    color: 'bg-pink-50 border-pink-200 hover:bg-pink-100'
  },
  {
    id: 6,
    category: 'Limpeza',
    icon: Zap,
    title: 'Remover Duplicatas',
    description: 'Limpar músicas repetidas e similares',
    prompt:
      'Analise e remova músicas duplicadas, versões repetidas e tracks similares das minhas playlists:',
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
  }
]
