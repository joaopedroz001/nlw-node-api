export function generateSlug(text: string): string {
    return text
        .normalize("NFD") // faz uma normalização -> 'é' = 'e´'
        .replace(/[\u0300-\u036f]/g, "") // substitui todos os acentos por "", g fala que pode ser mais de um
        .toLowerCase() // lowercase
        .replace(/[^\w\s-]/g, "") // substitui simbolos por ""
        .replace(/\s+/g, "-") // quando existem vários espaços em branco, substitui por "-"
}