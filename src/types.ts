interface WikiHistory {
  date: string,
  url: string,
  data: HistoryData
}

interface HistoryData {
  Events: Data[],
  Births: Data[],
  Deaths: Data[]
}

interface Data {
  year: string,
  text: string,
  html: string,
  no_year_html: string,
  links: Link[]
}

interface Link {
  title: string,
  link: string
}


export { WikiHistory, Data }
