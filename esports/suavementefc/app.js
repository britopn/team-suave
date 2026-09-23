/* =========================================================
   SUAVE ESPORTS
   DADOS + RENDERIZAÇÃO DO SITE
========================================================= */


/* =========================================================
   1. SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://aqsqbhlryozvcmqufsdq.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_rj7_Hlevuj1uxZUlvTaFNg_fmKwdnt0";


const suaveSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================================
   2. DADOS
========================================================= */

const suaveData = {

    team: {
        name: "SUAVEMENTE FC",
        logo: "logo-suave.png"
    },


    /* -----------------------------------------------------
       PRÓXIMOS JOGOS
    ----------------------------------------------------- */

    upcomingGames: [

        {
            date: "20 SET",
            time: "21:00",
            opponent: "EQUIPA A",
            competition: "TORNEIO PRO CLUBS",
            opponentLogo: null
        },

        {
            date: "20 SET",
            time: "21:30",
            opponent: "EQUIPA B",
            competition: "TORNEIO PRO CLUBS",
            opponentLogo: null
        },

        {
            date: "20 SET",
            time: "22:00",
            opponent: "EQUIPA C",
            competition: "TORNEIO PRO CLUBS",
            opponentLogo: null
        },

        {
            date: "20 SET",
            time: "22:30",
            opponent: "EQUIPA D",
            competition: "TORNEIO PRO CLUBS",
            opponentLogo: null
        }

    ],


    /* -----------------------------------------------------
       RESULTADOS
    ----------------------------------------------------- */

    results: [

        {
            date: "18 SET",
            opponent: "EQUIPA X",
            competition: "TORNEIO PRO CLUBS",
            suaveScore: 4,
            opponentScore: 2,
            opponentLogo: null
        },

        {
            date: "18 SET",
            opponent: "EQUIPA Y",
            competition: "TORNEIO PRO CLUBS",
            suaveScore: 2,
            opponentScore: 2,
            opponentLogo: null
        },

        {
            date: "17 SET",
            opponent: "EQUIPA Z",
            competition: "TORNEIO PRO CLUBS",
            suaveScore: 1,
            opponentScore: 3,
            opponentLogo: null
        }

    ],


    /* -----------------------------------------------------
       PLANTEL

       AGORA É CARREGADO DO SUPABASE.
    ----------------------------------------------------- */

    players: [],


    /* -----------------------------------------------------
       CLASSIFICAÇÃO

       Por agora continua manual.
    ----------------------------------------------------- */

    standings: [

        {
            team: "SUAVE FC",
            played: 5,
            wins: 3,
            draws: 1,
            losses: 1,
            points: 10,
            suave: true
        },

        {
            team: "EQUIPA A",
            played: 5,
            wins: 3,
            draws: 0,
            losses: 2,
            points: 9
        },

        {
            team: "EQUIPA B",
            played: 5,
            wins: 2,
            draws: 2,
            losses: 1,
            points: 8
        },

        {
            team: "EQUIPA C",
            played: 5,
            wins: 2,
            draws: 0,
            losses: 3,
            points: 6
        },

        {
            team: "EQUIPA D",
            played: 5,
            wins: 1,
            draws: 1,
            losses: 3,
            points: 4
        }

    ]

};


/* =========================================================
   3. CARREGAR PLANTEL DO SUPABASE
========================================================= */

async function loadPlayers() {

    const track =
        document.getElementById("players-track");


    if (track) {

        track.innerHTML = `
            <div class="player-card">
                <div class="player-info">
                    <strong>A CARREGAR...</strong>
                    <span>PLANTEL</span>
                </div>
            </div>
        `;

    }


    try {

        const {
            data,
            error
        } = await suaveSupabase
            .from("players")
            .select(
                "id, name, number, position, photo_url, created_at, career_games, career_goals, career_assists, career_motm, career_rating"
            )
            .order(
                "number",
                {
                    ascending: true
                }
            );


        if (error) {

            throw error;

        }


        suaveData.players =
            (data || []).map(player => ({

                id:
                    player.id,

                name:
                    player.name,

                number:
                    player.number,

                position:
                    player.position,

                image:
                    player.photo_url || null,

                games:
                    player.career_games ?? 0,

                goals:
                    player.career_goals ?? 0,

                assists:
                    player.career_assists ?? 0,

                motm:
                    player.career_motm ?? 0,

                rating:
                    player.career_rating ?? 0

            }));


        console.log(
            `✅ Plantel carregado: ${suaveData.players.length} jogador(es)`
        );


        renderPlayers();

    }

    catch (error) {

        console.error(
            "❌ Erro ao carregar plantel do Supabase:",
            error
        );


        if (track) {

            track.innerHTML = `
                <div class="player-card">
                    <div class="player-info">
                        <strong>ERRO</strong>
                        <span>PLANTEL INDISPONÍVEL</span>
                    </div>
                </div>
            `;

        }

    }

}

/* =========================================================
   4. CARREGAR RESULTADOS DO SUPABASE
========================================================= */

async function loadResults() {

    const leagueContainer =
        document.getElementById(
            "league-results"
        );

    const otherContainer =
        document.getElementById(
            "other-results"
        );


    const loadingHTML = `
        <article class="match-card">
            <div class="match-meta">
                A CARREGAR RESULTADOS...
            </div>
        </article>
    `;


    if (leagueContainer) {
        leagueContainer.innerHTML =
            loadingHTML;
    }


    if (otherContainer) {
        otherContainer.innerHTML =
            loadingHTML;
    }


    try {

        const {
            data,
            error
        } = await suaveSupabase

            .from("match_series")

            .select(`
                id,
                opponent_name,
                opponent_logo_url,
                competition,
                format,
                played_at,
                suave_series_score,
                opponent_series_score,
                status
            `)

            .eq(
                "status",
                "completed"
            )

            .order(
                "played_at",
                {
                    ascending: false
                }
            );


        if (error) {
            throw error;
        }


        suaveData.results =
            (data || []).map(
                series => {

                    let date =
                        "—";


                    if (series.played_at) {

                        const parsedDate =
                            new Date(
                                series.played_at
                            );


                        date =
                            parsedDate
                                .toLocaleDateString(
                                    "pt-PT",
                                    {
                                        day:
                                            "2-digit",

                                        month:
                                            "short"
                                    }
                                )
                                .replace(
                                    ".",
                                    ""
                                )
                                .toUpperCase();

                    }


                    const competition =
                        String(
                            series.competition ||
                            ""
                        )
                        .trim()
                        .toUpperCase();


                    const format =
                        String(
                            series.format ||
                            ""
                        )
                        .trim()
                        .toUpperCase();


                    const isLeagueMatch =
                        competition ===
                            "PRO CLUBS" &&
                        format ===
                            "LEAGUE MATCH";


                    return {

                        id:
                            series.id,

                        date,

                        opponent:
                            series.opponent_name,

                        competition,

                        format,

                        competitionLabel:
                            `${competition} · ${format}`,

                        suaveScore:
                            series.suave_series_score,

                        opponentScore:
                            series.opponent_series_score,

                        opponentLogo:
                            series.opponent_logo_url ||
                            null,

                        isLeagueMatch

                    };

                }
            );


        console.log(
            `✅ Resultados carregados: ${suaveData.results.length}`
        );


        console.log(
            `⚽ League Matches: ${
                suaveData.results.filter(
                    game =>
                        game.isLeagueMatch
                ).length
            }`
        );


        console.log(
            `🏆 Outros resultados: ${
                suaveData.results.filter(
                    game =>
                        !game.isLeagueMatch
                ).length
            }`
        );


        renderResults();

        renderStats();

    }

    catch (error) {

        console.error(
            "❌ Erro ao carregar resultados do Supabase:",
            error
        );


        const errorHTML = `
            <article class="match-card">
                <div class="match-meta">
                    RESULTADOS INDISPONÍVEIS
                </div>
            </article>
        `;


        if (leagueContainer) {
            leagueContainer.innerHTML =
                errorHTML;
        }


        if (otherContainer) {
            otherContainer.innerHTML =
                errorHTML;
        }

    }

}

/* =========================================================
   4. HELPERS
========================================================= */

function opponentLogoHTML(game, className = "") {

    if (game.opponentLogo) {

        return `
            <img
                src="${game.opponentLogo}"
                alt="${game.opponent}"
                class="${className}"
            >
        `;

    }


    const initial =
        game.opponent && game.opponent !== "TBA"
            ? game.opponent.charAt(0)
            : "?";


    return `
        <div class="placeholder-logo ${className}">
            ${initial}
        </div>
    `;

}


function getResultStatus(game) {

    if (game.suaveScore > game.opponentScore) {

        return {
            text: "VITÓRIA",
            className: "win"
        };

    }


    if (game.suaveScore < game.opponentScore) {

        return {
            text: "DERROTA",
            className: "loss"
        };

    }


    return {
        text: "EMPATE",
        className: "draw"
    };

}


/* =========================================================
   5. PRÓXIMO JOGO — BARRA DO HERO
========================================================= */


async function renderNextGameStrip() {

    const date =
        document.getElementById(
            "next-game-date"
        );

    const opponent =
        document.getElementById(
            "next-game-opponent"
        );

    const competition =
        document.getElementById(
            "next-game-competition"
        );

    const logo =
        document.getElementById(
            "next-game-opponent-logo"
        );


    if (
        !date ||
        !opponent ||
        !competition
    ) {
        return;
    }


    // Encontrar o cartão inteiro do PRÓXIMO JOGO
    const strip =
        date.closest(
            ".featured-match"
        );


    // Por defeito fica escondido.
    // Só aparece se existir realmente um jogo futuro.
    if (strip) {
        strip.style.display =
            "none";
    }


    try {

        const agora =
            new Date().toISOString();


        const {
            data: jogo,
            error
        } = await suaveSupabase

            .from(
                "scheduled_matches"
            )

            .select(`
                id,
                opponent_name,
                opponent_logo_url,
                competition,
                scheduled_at,
                status
            `)

            .eq(
                "status",
                "scheduled"
            )

            .gte(
                "scheduled_at",
                agora
            )

            .order(
                "scheduled_at",
                {
                    ascending: true
                }
            )

            .limit(1)

            .maybeSingle();


        if (error) {
            throw error;
        }


        // Não há nenhum jogo marcado.
        // O bloco continua completamente escondido.
        if (!jogo) {

            console.log(
                "📅 Nenhum próximo jogo marcado."
            );

            return;
        }


        const scheduledDate =
            new Date(
                jogo.scheduled_at
            );


        const dataFormatada =
            scheduledDate
                .toLocaleDateString(
                    "pt-PT",
                    {
                        day:
                            "2-digit",

                        month:
                            "short"
                    }
                )
                .replace(
                    ".",
                    ""
                )
                .toUpperCase();


        const horaFormatada =
            scheduledDate
                .toLocaleTimeString(
                    "pt-PT",
                    {
                        hour:
                            "2-digit",

                        minute:
                            "2-digit"
                    }
                );


        date.textContent =
            `${dataFormatada} · ${horaFormatada}`;


        opponent.textContent =
            jogo.opponent_name;


        competition.textContent =
            jogo.competition;


        // ==========================================
        // LOGO DO ADVERSÁRIO
        // ==========================================

        if (logo) {

            if (
                jogo.opponent_logo_url
            ) {

                if (
                    logo.tagName ===
                    "IMG"
                ) {

                    logo.src =
                        jogo.opponent_logo_url;

                }

                else {

                    logo.innerHTML = `
                        <img
                            src="${jogo.opponent_logo_url}"
                            alt="${jogo.opponent_name}"
                        >
                    `;

                }


                logo.style.display =
                    "";

            }

            else {

                // Sem logo:
                // não inventamos nenhum.
                logo.style.display =
                    "none";

            }

        }


        // Agora sim existe jogo:
        // mostramos o bloco.
        if (strip) {

            strip.style.display =
                "";

        }


        console.log(
            "📅 Próximo jogo:",
            jogo.opponent_name,
            scheduledDate
        );

    }

    catch (error) {

        console.error(
            "❌ Erro ao carregar próximo jogo:",
            error
        );


        // Se houver erro, não mostramos
        // informação falsa ou desatualizada.
        if (strip) {

            strip.style.display =
                "none";

        }

    }

}


/* =========================================================
   6. PRÓXIMOS JOGOS
========================================================= */

function renderUpcomingGames() {

    const container =
        document.getElementById(
            "upcoming-games"
        );


    container.innerHTML = "";


    suaveData.upcomingGames
        .slice(1)
        .forEach(game => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "game-card";


            card.innerHTML = `

                <div class="game-date">
                    ${game.date} · ${game.time}
                </div>


                <div class="game-teams">

                    <div class="game-team">

                        <img
                            src="${suaveData.team.logo}"
                            alt="${suaveData.team.name}"
                        >

                        <strong>
                            ${suaveData.team.name}
                        </strong>

                    </div>


                    <span class="game-vs">
                        VS
                    </span>


                    <div class="game-team">

                        ${opponentLogoHTML(game)}

                        <strong>
                            ${game.opponent}
                        </strong>

                    </div>

                </div>


                <div class="game-competition">
                    ${game.competition}
                </div>

            `;


            container.appendChild(
                card
            );

        });

}


/* =========================================================
   7. RESULTADOS
========================================================= */

function renderResults() {

    const leagueContainer =
        document.getElementById(
            "league-results"
        );

    const otherContainer =
        document.getElementById(
            "other-results"
        );


    if (!leagueContainer || !otherContainer) {
        return;
    }


    leagueContainer.innerHTML = "";
    otherContainer.innerHTML = "";


    const leagueResults =
        suaveData.results.filter(
            game =>
                game.isLeagueMatch
        );


    const otherResults =
        suaveData.results.filter(
            game =>
                !game.isLeagueMatch
        );


    function createResultCard(game) {

        const status =
            getResultStatus(game);


        const card =
            document.createElement(
                "article"
            );


        card.className =
            "match-card";


        card.dataset.seriesId =
            game.id;


        card.innerHTML = `

            <div class="match-meta">

                RESULTADO FINAL ·
                ${game.date} ·
                ${game.competitionLabel}

            </div>


            <div class="match">

                <div class="club">

                    <img
                        src="${suaveData.team.logo}"
                        alt="${suaveData.team.name}"
                    >

                    <span>
                        ${suaveData.team.name}
                    </span>

                </div>


                <div class="score">

                    <strong>
                        ${game.suaveScore}
                    </strong>

                    <span>
                        ×
                    </span>

                    <strong>
                        ${game.opponentScore}
                    </strong>

                </div>


                <div class="club opponent">

                    ${opponentLogoHTML(game)}

                    <span>
                        ${game.opponent}
                    </span>

                </div>

            </div>


            <div
                class="
                    match-status
                    ${status.className}
                "
            >
                ${status.text}
            </div>

        `;

card.addEventListener(
    "click",
    async () => {

        // Se já está aberto, volta ao resultado normal
if (card.classList.contains("details-open")) {

    card.classList.remove(
        "details-open"
    );

    card.innerHTML =
        card.dataset.originalHtml;

    card.style.width = "";
    card.style.minWidth = "";
    card.style.maxWidth = "";

    card.style.height = "";
    card.style.minHeight = "";
    card.style.maxHeight = "";

    return;
}


        // Guardar o card original
        card.dataset.originalHtml =
            card.innerHTML;

            // Guardar exatamente o tamanho atual do card
const cardRect =
    card.getBoundingClientRect();

card.style.width =
    `${cardRect.width}px`;

card.style.minWidth =
    `${cardRect.width}px`;

card.style.maxWidth =
    `${cardRect.width}px`;

card.style.height =
    `${cardRect.height}px`;

card.style.minHeight =
    `${cardRect.height}px`;

card.style.maxHeight =
    `${cardRect.height}px`;

            


        // Feedback enquanto carrega
        card.innerHTML = `
            <div class="match-meta">
                A CARREGAR DETALHES...
            </div>
        `;


        const details =
            await openMatchDetails(
                game.id
            );


        if (!details) {

            card.innerHTML =
                card.dataset.originalHtml;

            return;
        }


        const {
            series,
            matches,
            playerStats
        } = details;


        // ==========================================
// NOME VISÍVEL DO JOGADOR
// ==========================================

const getPlayerName = player => {

    if (player.player_id) {

        const squadPlayer =
            suaveData.players.find(
                squadPlayer =>
                    Number(squadPlayer.id) ===
                    Number(player.player_id)
            );

        if (squadPlayer) {
            return squadPlayer.name;
        }

    }

    return player.ea_name;
};

        // ==========================================
        // MARCADORES
        // ==========================================

        const scorers =
            playerStats
                .filter(
                    player =>
                        Number(player.goals) > 0
                )
                .map(
                    player =>
                        `${getPlayerName(player)} ×${player.goals}`
                );


        // ==========================================
        // ASSISTÊNCIAS
        // ==========================================

        const assists =
            playerStats
                .filter(
                    player =>
                        Number(player.assists) > 0
                )
                .map(
                    player =>
                        `${getPlayerName(player)} ×${player.assists}`
                );


        // ==========================================
        // MVP
        // ==========================================

        const mvp =
            [...playerStats]
                .sort(
                    (a, b) =>
                        Number(b.rating || 0) -
                        Number(a.rating || 0)
                )[0];

        // ==========================================
        // JOGOS DA SÉRIE
        // ==========================================

        const gamesHTML =
            matches.length > 1

                ? matches
                    .map(
                        match => `
                            <div class="result-detail-game">
                                <span>
                                    JOGO ${match.game_number}
                                </span>

                                <strong>
                                    ${match.suave_score}
                                    ×
                                    ${match.opponent_score}
                                </strong>
                            </div>
                        `
                    )
                    .join("")

                : "";


        card.classList.add(
            "details-open"
        );


        card.innerHTML = `

            <div class="match-meta">
                ${game.date} ·
                ${series.competition} ·
                ${series.format}
            </div>


            <div class="result-detail-score">

                <strong>
                    ${series.suave_series_score}
                    ×
                    ${series.opponent_series_score}
                </strong>

                <span>
                    ${series.opponent_name}
                </span>

            </div>


            ${
                gamesHTML
                    ? `
                        <div class="result-detail-games">
                            ${gamesHTML}
                        </div>
                    `
                    : ""
            }


            <div class="result-detail-info">

                <div>
                    <span>GOLOS</span>

                    <strong>
                        ${
                            scorers.length
                                ? scorers.join(" · ")
                                : "—"
                        }
                    </strong>
                </div>


                <div>
                    <span>ASSISTÊNCIAS</span>

                    <strong>
                        ${
                            assists.length
                                ? assists.join(" · ")
                                : "—"
                        }
                    </strong>
                </div>


                <div>
                    <span>MVP</span>

                    <strong>
                        ${
                            mvp
                                ? `${getPlayerName(mvp)} · ${mvp.rating}`
                                : "—"
                        }
                    </strong>
                </div>

            </div>


            <div class="result-detail-back">
                ← VOLTAR AO RESULTADO
            </div>

        `;

    }
);      

        
        return card;

    }


    // ==================================================
    // PRO CLUBS · LEAGUE MATCH
    // ==================================================

    if (leagueResults.length === 0) {

        leagueContainer.innerHTML = `

            <article class="match-card">

                <div class="match-meta">
                    SEM LEAGUE MATCHES
                </div>

            </article>

        `;

    }

    else {

        leagueResults.forEach(
            game => {

                leagueContainer.appendChild(
                    createResultCard(game)
                );

            }
        );

    }


    // ==================================================
    // OUTROS RESULTADOS
    // ==================================================

    if (otherResults.length === 0) {

        otherContainer.innerHTML = `

            <article class="match-card">

                <div class="match-meta">
                    SEM OUTROS RESULTADOS
                </div>

            </article>

        `;

    }

    else {

        otherResults.forEach(
            game => {

                otherContainer.appendChild(
                    createResultCard(game)
                );

            }
        );

    }

}

/* =========================================================
   8. DETALHES DE UM RESULTADO
========================================================= */

async function openMatchDetails(seriesId) {

    console.log(
        `🔎 A carregar série ${seriesId}...`
    );


    try {

        // ----------------------------------------------
        // DADOS DA SÉRIE
        // ----------------------------------------------

        const {
            data: series,
            error: seriesError
        } = await suaveSupabase
            .from("match_series")
            .select(`
                id,
                opponent_name,
                opponent_logo_url,
                competition,
                format,
                played_at,
                suave_series_score,
                opponent_series_score,
                status
            `)
            .eq(
                "id",
                seriesId
            )
            .single();


        if (seriesError) {
            throw seriesError;
        }


        // ----------------------------------------------
        // JOGOS DA SÉRIE
        // ----------------------------------------------

        const {
            data: matches,
            error: matchesError
        } = await suaveSupabase
            .from("matches")
            .select(`
                id,
                game_number,
                suave_score,
                opponent_score,
                suave_shots_on_target,
                opponent_shots_on_target,
                suave_red_cards,
                opponent_red_cards,
                suave_saves,
                opponent_saves,
                suave_tackles,
                opponent_tackles,
                suave_passes,
                opponent_passes,
                ea_match_id,
                match_type
            `)
            .eq(
                "series_id",
                seriesId
            )
            .order(
                "game_number",
                {
                    ascending: true
                }
            );


        if (matchesError) {
            throw matchesError;
        }


        const matchIds =
            (matches || [])
                .map(
                    match =>
                        match.id
                );


        let playerStats = [];


        // ----------------------------------------------
        // ESTATÍSTICAS DOS JOGADORES
        // ----------------------------------------------

        if (matchIds.length > 0) {

            const {
                data,
                error
            } = await suaveSupabase
                .from("match_player_stats")
                .select(`
                    id,
                    match_id,
                    player_id,
                    ea_name,
                    position,
                    goals,
                    assists,
                    shots,
                    tackles,
                    tackle_attempts,
                    passes_made,
                    pass_attempts,
                    saves,
                    goals_conceded,
                    red_cards,
                    rating,
                    man_of_the_match
                `)
                .in(
                    "match_id",
                    matchIds
                );


            if (error) {
                throw error;
            }


            playerStats =
                data || [];

        }


        console.log(
    "✅ DETALHES DA SÉRIE:",
    {
        series,
        matches,
        playerStats
    }
);


return {
    series,
    matches:
        matches || [],
    playerStats
};

    }

    catch (error) {

        console.error(
            "❌ Erro ao carregar detalhes do resultado:",
            error
        );


        return null;

    }

}

/* =========================================================
   8. PLANTEL
========================================================= */

function renderPlayers() {

    const track =
        document.getElementById(
            "players-track"
        );


    track.innerHTML = "";


    if (
        !suaveData.players ||
        suaveData.players.length === 0
    ) {

        track.innerHTML = `
            <div class="player-card">

                <div class="player-placeholder">
                    ?
                </div>

                <div class="player-info">

                    <strong>
                        SEM JOGADORES
                    </strong>

                    <span>
                        PLANTEL
                    </span>

                </div>

            </div>
        `;


        return;

    }


    suaveData.players.forEach(
        player => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "player-card";


            let playerVisual;


            if (player.image) {

                playerVisual = `

                    <img
                        class="player-image"
                        src="${player.image}"
                        alt="${player.name}"
                        loading="lazy"
                        onerror="
                            this.style.display='none';
                            this.nextElementSibling.style.display='flex';
                        "
                    >

                    <div
                        class="player-placeholder"
                        style="display:none;"
                    >
                        ${player.name.charAt(0)}
                    </div>

                `;

            }

            else {

                playerVisual = `

                    <div class="player-placeholder">
                        ${player.name.charAt(0)}
                    </div>

                `;

            }


            card.innerHTML = `

                <div class="player-number">

                    ${String(
                        player.number
                    ).padStart(
                        2,
                        "0"
                    )}

                </div>


                ${playerVisual}


                <div class="player-info">

                    <strong>
                        ${player.name}
                    </strong>

                    <span>
                        ${player.position}
                    </span>

                </div>

            `;


                card.addEventListener(
                    "click",
                    () => {

                        openPlayerModal(player);

                    }
                );


            track.appendChild(
                card
            );

        }
    );

}

/* =========================================================
   PERFIL DO JOGADOR
========================================================= */

function openPlayerModal(player) {

    const modal =
        document.getElementById("player-modal");

    if (!modal) {
        return;
    }


    const visual =
        document.getElementById("player-modal-visual");

    const number =
        document.getElementById("player-modal-number");

    const name =
        document.getElementById("player-modal-name");

    const position =
        document.getElementById("player-modal-position");


    number.textContent =
        `#${String(player.number ?? 0).padStart(2, "0")}`;

    name.textContent =
        player.name || "JOGADOR";

    position.textContent =
        player.position || "—";


    document.getElementById("player-stat-games").textContent =
        player.games ?? 0;

    document.getElementById("player-stat-goals").textContent =
        player.goals ?? 0;

    document.getElementById("player-stat-assists").textContent =
        player.assists ?? 0;

    document.getElementById("player-stat-motm").textContent =
        player.motm ?? 0;


    const rating =
        Number(player.rating);

    document.getElementById("player-stat-rating").textContent =
        Number.isFinite(rating) && rating > 0
            ? rating.toFixed(1)
            : "—";


    if (player.image) {

        visual.innerHTML = `
            <img
                class="player-modal-image"
                src="${player.image}"
                alt="${player.name}"
            >
        `;

    }

    else {

        visual.innerHTML = `
            <div class="player-modal-placeholder">
                ${(player.name || "?").charAt(0)}
            </div>
        `;

    }


    modal.classList.add("is-open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}


function closePlayerModal() {

    const modal =
        document.getElementById("player-modal");

    if (!modal) {
        return;
    }


    modal.classList.remove("is-open");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

}


document.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                "[data-player-modal-close]"
            )
        ) {

            closePlayerModal();

        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closePlayerModal();

        }

    }
);

/* =========================================================
   9. CLASSIFICAÇÃO
========================================================= */

async function renderStandings() {

const divisionLogo =
    document.getElementById(
        "division-logo"
    );

    const clubName =
        document.getElementById(
            "division-club-name"
        );

    const skillRating =
        document.getElementById(
            "division-skill-rating"
        );


 if (
    !divisionLogo ||
    !clubName ||
    !skillRating
) {
    return;
}


    try {

        const {
            data: club,
            error
        } = await suaveSupabase

            .from("ea_club_stats")

            .select(
                "club_name, current_division, skill_rating"
            )

            .eq(
                "id",
                1
            )

            .single();


        if (error) {
            throw error;
        }


const division =
    club.current_division;

if (division) {

    divisionLogo.src =
        `division-${division}.png`;

    divisionLogo.alt =
        `Divisão ${division}`;

}
else {

    divisionLogo.src =
        "division-elite.png";

    divisionLogo.alt =
        "Divisão Elite";

}

        clubName.textContent =
            club.club_name ||
            "SUAVEMENTE FC";

        skillRating.textContent =
            club.skill_rating ?? "—";


        console.log(
            "✅ Divisão EA:",
            club.current_division,
            "| Skill Rating:",
            club.skill_rating
        );

    }

    catch (error) {

        console.error(
            "❌ Erro ao carregar divisão EA:",
            error
        );

        divisionLogo.removeAttribute("src");

        clubName.textContent =
            "SUAVEMENTE FC";

        skillRating.textContent = "—";

    }

}

/* =========================================================
   10. ESTATÍSTICAS AUTOMÁTICAS
========================================================= */

function calculateStats() {

    const results =
    suaveData.results.filter(
        game =>
            game.isLeagueMatch
    );

    let wins = 0;
    let draws = 0;
    let losses = 0;

    let goalsFor = 0;
    let goalsAgainst = 0;


    results.forEach(
        game => {

            goalsFor +=
                game.suaveScore;


            goalsAgainst +=
                game.opponentScore;


            if (
                game.suaveScore >
                game.opponentScore
            ) {

                wins++;

            }

            else if (
                game.suaveScore <
                game.opponentScore
            ) {

                losses++;

            }

            else {

                draws++;

            }

        }
    );


    const played =
        results.length;


    const points =
        (wins * 3) +
        draws;


    const possiblePoints =
        played * 3;


    const performance =
        possiblePoints > 0

            ? Math.round(
                (
                    points /
                    possiblePoints
                ) * 100
            )

            : 0;


    return {

        played,
        wins,
        draws,
        losses,

        goalsFor,
        goalsAgainst,

        goalDifference:
            goalsFor -
            goalsAgainst,

        performance

    };

}


/* =========================================================
   11. MOSTRAR ESTATÍSTICAS
========================================================= */

async function renderStats() {

    const container =
        document.getElementById(
            "stats-grid"
        );

    if (!container) {
        return;
    }


    try {

        const {
            data: club,
            error
        } = await suaveSupabase

            .from("ea_club_stats")

            .select(
                "games_played, wins, draws, losses, goals, goals_against, clean_sheets"
            )

            .eq(
                "id",
                1
            )

            .single();


        if (error) {
            throw error;
        }


        const goalDifference =
    (club.goals ?? 0) -
    (club.goals_against ?? 0);

        const winRate =
    (club.games_played ?? 0) > 0
        ? Math.round(
            ((club.wins ?? 0) /
            club.games_played) * 100
        )
        : 0;
            
            


        const items = [

            {
                value:
                    club.games_played ?? 0,

                label:
                    "JOGOS"
            },

            {
                value:
                    club.wins ?? 0,

                label:
                    "VITÓRIAS",

                accent:
                    true
            },

            {
                value:
                    club.draws ?? 0,

                label:
                    "EMPATES"
            },

            {
                value:
                    club.losses ?? 0,

                label:
                    "DERROTAS"
            },

            {
                value:
                    club.goals ?? 0,

                label:
                    "GOLOS MARCADOS"
            },

            {
                value:
                    club.goals_against ?? 0,

                label:
                    "GOLOS SOFRIDOS"
            },

            {
                value:
                    goalDifference > 0
                        ? `+${goalDifference}`
                        : goalDifference,

                label:
                    "DIFERENÇA"
            },

            {
                value:
                    `${winRate}%`,

                label:
                    "% VITÓRIAS",

                accent:
                    true
            }

        ];


        container.innerHTML = "";


        items.forEach(
            item => {

                const stat =
                    document.createElement(
                        "article"
                    );


                stat.className =
                    `stat ${
                        item.accent
                            ? "accent"
                            : ""
                    }`;


                stat.innerHTML = `

                    <strong>
                        ${item.value}
                    </strong>

                    <span>
                        ${item.label}
                    </span>

                `;


                container.appendChild(
                    stat
                );

            }
        );


        console.log(
            "✅ Estatísticas da época EA carregadas:",
            club
        );

    }

    catch (error) {

        console.error(
            "❌ Erro ao carregar estatísticas EA:",
            error
        );

        container.innerHTML = "";

    }

}


/* =========================================================
   12. CARROSSÉIS
========================================================= */

function setupCarousels() {

    const leagueResults =
        document.getElementById(
            "league-results"
        );

    const otherResults =
        document.getElementById(
            "other-results"
        );

    const players =
        document.getElementById(
            "players-track"
        );


    // ==================================================
    // LEAGUE MATCHES
    // ==================================================

    const leagueNext =
        document.getElementById(
            "league-results-next"
        );

    const leaguePrev =
        document.getElementById(
            "league-results-prev"
        );


    if (
        leagueResults &&
        leagueNext
    ) {

        leagueNext.addEventListener(
            "click",
            () => {

                leagueResults.scrollBy({
                    left: 450,
                    behavior: "smooth"
                });

            }
        );

    }


    if (
        leagueResults &&
        leaguePrev
    ) {

        leaguePrev.addEventListener(
            "click",
            () => {

                leagueResults.scrollBy({
                    left: -450,
                    behavior: "smooth"
                });

            }
        );

    }


    // ==================================================
    // OUTROS RESULTADOS
    // ==================================================

    const otherNext =
        document.getElementById(
            "other-results-next"
        );

    const otherPrev =
        document.getElementById(
            "other-results-prev"
        );


    if (
        otherResults &&
        otherNext
    ) {

        otherNext.addEventListener(
            "click",
            () => {

                otherResults.scrollBy({
                    left: 450,
                    behavior: "smooth"
                });

            }
        );

    }


    if (
        otherResults &&
        otherPrev
    ) {

        otherPrev.addEventListener(
            "click",
            () => {

                otherResults.scrollBy({
                    left: -450,
                    behavior: "smooth"
                });

            }
        );

    }


    // ==================================================
    // PLANTEL
    // ==================================================

    const playersNext =
        document.getElementById(
            "players-next"
        );

    const playersPrev =
        document.getElementById(
            "players-prev"
        );


    if (
        players &&
        playersNext
    ) {

        playersNext.addEventListener(
            "click",
            () => {

                players.scrollBy({
                    left: 350,
                    behavior: "smooth"
                });

            }
        );

    }


    if (
        players &&
        playersPrev
    ) {

        playersPrev.addEventListener(
            "click",
            () => {

                players.scrollBy({
                    left: -350,
                    behavior: "smooth"
                });

            }
        );

    }

}


/* =========================================================
   13. ARRASTAR PLANTEL COM O RATO
========================================================= */

function setupPlayerDrag() {

    const slider =
        document.getElementById(
            "players-track"
        );


    let mouseDown =
        false;

    let startX;

    let scrollLeft;


    slider.addEventListener(
        "mousedown",
        event => {

            mouseDown =
                true;


            startX =
                event.pageX -
                slider.offsetLeft;


            scrollLeft =
                slider.scrollLeft;

        }
    );


    slider.addEventListener(
        "mouseleave",
        () => {

            mouseDown =
                false;

        }
    );


    slider.addEventListener(
        "mouseup",
        () => {

            mouseDown =
                false;

        }
    );


    slider.addEventListener(
        "mousemove",
        event => {

            if (!mouseDown) {
                return;
            }


            event.preventDefault();


            const x =
                event.pageX -
                slider.offsetLeft;


            const walk =
                (
                    x -
                    startX
                ) * 1.5;


            slider.scrollLeft =
                scrollLeft -
                walk;

        }
    );

}


/* =========================================================
   14. NAVEGAÇÃO
========================================================= */

function setupNavigation() {

    const sections =
        document.querySelectorAll(
            "section[id]"
        );


    const links =
        document.querySelectorAll(
            ".main-nav a"
        );


    function updateNav() {

        let current =
            "inicio";


        sections.forEach(
            section => {

                if (
                    window.scrollY >=
                    section.offsetTop -
                    180
                ) {

                    current =
                        section.id;

                }

            }
        );


        links.forEach(
            link => {

                link.classList.remove(
                    "active"
                );


                if (
                    link.getAttribute(
                        "href"
                    ) ===
                    `#${current}`
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    window.addEventListener(
        "scroll",
        updateNav
    );


    updateNav();

}


/* =========================================================
   15. INICIAR SITE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        // Próximo jogo real do Supabase
        await renderNextGameStrip();


        // Classificação
        renderStandings();


        // Resultados reais do Supabase
        await loadResults();


        // Carrosséis
        setupCarousels();


        // Arrastar plantel com rato
        setupPlayerDrag();


        // Navegação
        setupNavigation();


        // Plantel real do Supabase
        await loadPlayers();

    }
);