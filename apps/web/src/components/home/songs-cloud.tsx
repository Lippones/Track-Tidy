'use client'
import { IconCloud } from '@workspace/ui/components/magicui/icon-cloud'
import { useMediaQuery } from '@uidotdev/usehooks'

const images = [
  'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSE3KwwEsHL8FCo-hfQN1jmu74zwQxNhN-rUPlNGexRvNF7k1olkLOWDYL9huU0',
  'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQphR8hjqKtyyzlKlOn5TI568zHHeQGFuxukEPftVPfl9hyqL3DdsVJjQ56aHUry',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM3oIXAwrSJF4-cXd4iGXhmWKjiPYvOB04uGEztOacWwee909KTJq0aZsepIkp',
  'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSf-gGu54f7kh75hYtS36zqjufj4mdSLK0J3EqFbXrPIpN7PUIgBpuGP5sMjjkY',
  'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRhnFE8YRXxPKE4zLcgkBl3pV7a-HHon8LrEOGAOt4OGC3xsCDaTWrxmri6VaUb',
  'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTjQ9ohYTtkLrDMjuz_97lpywNrH_mr_PcvupH91jKB4SFeAe2ZyqsjPBhd95ik',
  'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSLJL9_OSqqa1Y5xfGGF4xt4RmxUYxzgR2cWPWmGxnV0v5vVthhofHoIXj-iLgC',
  'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQgGauJsfgE-a0HQfr6phtJcn41sYBTRaHS6PKnkJ0MaZBcV7t4_EhjQEhLpe8n',
  'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSGJij7nbtlGGWAs03kAhP9n8gjGX6tVcYNXaAh73Jbls8A1i57OEo1ExVCjytG',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFwe67UXax0JufOTTp0oLiFqIBm3TSs705ZLkziyv2Wq3a43IJtYvjLxW3g4Um',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjUjvPBig5opga5khL0euxThbKSfQxgPR4YYaeTaIS8o8dfH7v4PtUpZhCGf7P',
  'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQDYuaEzLhZPf3X1aA-WrTNSCEH_oBtvoHw2vMgXky5sSvXs1_aofl3s3C1zdQt',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJYaH7a9hbgrzidpfzDZIO3daGTkiOkq76oUvPW3MBHMBbyewTBfWsghnN73s6',
  'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQMiOtWdqTfkSU9ul2pZ6mLq9Yu69c3cEEKls8iqf-q_aTg_6O2udgjHtTdasnz',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR20T_jD4JRrwa2ixYrHtBm-gHy-rgg3lr9JI7_ojXFnuvwv96IGirYXMrsSxBZ',
  'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ0XpUFXqR443KGEV74VWG39Ghok4cOvBXINxgrhJ-_2agrInRy8dmuU7fEVBQJ',
  'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ6wby0ITLkmMnSBqbz4mTj9i5-ZwQF4UyAmn28AKQYd_dLvmzgKfbI6oH3dDTW',
  'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ86HOxq6TlZoSkYJA0B3PKqeW3NP0BkOvaFuNek7VJc5wn_KNxaTsTCdO_3aPT',
  'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSM-VqtRjqoUMXUT_mbFXKhmoek8n48Ez4uOT3mXy64JpMZ3qvp7qudZo8I6o6N',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT30ahMQkeuk0d3sibNNB30blUxO2tJasY_kmdpNe6oTcl_Tbiukvglhp-j4obh',
  'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTm7bl83dk2Hw2EpkYZIRXLuUOx9oxW20u_TcXChZb_gZfP8o_z66cIhvqPLYZr',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0EmcNO0McmBbpeSX9gz4QkwhK9C0QLAkV7nHcKTNx4bFrI8nxPgnaU17cRVV9',
  'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRX1urLsxGJUZhTDCx6bu2gbTJVsEimEwt4ZO9yK2cP2Wz_Uzjlp37sypRcAg7h',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXTxPDj6eZsvnQKw6VC9z1w_rsl9Qyfs7fKoo-7JU8-DaprgV2OnGQ-MjCBN8m',
  'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSWSeT5kQNRGToNNHKNJJGgU02yScWtw3xUqFmlY0MD138vmTSZMTAB15L6lqbg',
  'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcScK9z4NHduusPLg2EFJsskThuN4r39PzpI0FqgyrBRCdsoms9tPqi-jsKwd4Dw'
]

export function SongsCloud() {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)')

  return <IconCloud size={isSmallDevice ? 600 : 800} images={images} />
}
