import React from 'react';
import { Link } from 'react-router-dom';

const Athletes = () => {
    const athlete = {
        name: 'Kohei Uchimura',
        nickname: 'King Kohei',
        nationality: 'Japon',
        flag: '\u{1F1EF}\u{1F1F5}',
        born: '3 janvier 1989',
        birthplace: 'Kitakyushu, Japon',
        height: '1,61 m',
        weight: '54 kg',
        discipline: 'Gymnastique artistique masculine',
        speciality: 'Concours g\u00e9n\u00e9ral / Barre fixe',
        club: 'Konami Sports Club',
        yearsActive: '2006 - 2022',
        coach: 'Takashi Uchimura / Yuji Nishi',
        image: 'https://i.postimg.cc/T3y1kpSR/kohei-uchimura.jpg',
        bio: "Kohei Uchimura est consid\u00e9r\u00e9 comme le plus grand gymnaste de tous les temps. Surnomm\u00e9 \u00ab King Kohei \u00bb, il a domin\u00e9 la gymnastique mondiale pendant plus d'une d\u00e9cennie avec une \u00e9l\u00e9gance et une r\u00e9gularit\u00e9 in\u00e9gal\u00e9es. Sa qu\u00eate de la perfection et son d\u00e9vouement absolu au sport incarnent les valeurs d'excellence que Gymnova d\u00e9fend.",
        quote: "La perfection n'existe pas, mais c'est en la poursuivant qu'on atteint l'excellence.",
        palmares: [
            { event: 'Jeux Olympiques', details: [
                { year: '2012 Londres', medal: 'gold', result: 'Or - Concours g\u00e9n\u00e9ral individuel' },
                { year: '2012 Londres', medal: 'silver', result: 'Argent - Concours par \u00e9quipes' },
                { year: '2016 Rio', medal: 'gold', result: 'Or - Concours g\u00e9n\u00e9ral individuel' },
                { year: '2008 P\u00e9kin', medal: 'silver', result: 'Argent - Concours g\u00e9n\u00e9ral individuel' },
                { year: '2008 P\u00e9kin', medal: 'silver', result: 'Argent - Concours par \u00e9quipes' },
            ]},
            { event: 'Championnats du Monde', details: [
                { year: '2009 Londres', medal: 'gold', result: 'Or - Concours g\u00e9n\u00e9ral individuel' },
                { year: '2010 Rotterdam', medal: 'gold', result: 'Or - Concours g\u00e9n\u00e9ral individuel' },
                { year: '2011 Tokyo', medal: 'gold', result: 'Or - Concours g\u00e9n\u00e9ral individuel' },
                { year: '2013 Anvers', medal: 'gold', result: 'Or - Concours g\u00e9n\u00e9ral individuel' },
                { year: '2014 Nanning', medal: 'gold', result: 'Or - Concours g\u00e9n\u00e9ral individuel' },
                { year: '2015 Glasgow', medal: 'gold', result: 'Or - Concours g\u00e9n\u00e9ral individuel' },
                { year: '2018 Doha', medal: 'gold', result: 'Or - Barre fixe' },
            ]},
        ],
        stats: [
            { label: 'M\u00e9dailles olympiques', value: '5', icon: '\u{1F3C5}' },
            { label: 'Titres mondiaux', value: '10', icon: '\u{1F3C6}' },
            { label: 'Titres conscutifs au g\u00e9n\u00e9ral', value: '6', icon: '\u{1F947}' },
            { label: 'Ann\u00e9es au sommet', value: '16', icon: '\u2B50' },
        ],
        equipment: [
            'Barre fixe',
            'Barres parall\u00e8les',
            'Anneaux',
            'Cheval d\'ar\u00e7ons',
            'Sol',
            'Saut',
        ]
    };

    const getMedalEmoji = (medal) => {
        switch (medal) {
            case 'gold': return '\u{1F947}';
            case 'silver': return '\u{1F948}';
            case 'bronze': return '\u{1F949}';
            default: return '';
        }
    };

    return (
        <div className="products-container">
            {/* Breadcrumb */}
            <div style={{
                marginBottom: 'var(--spacing-md)',
                marginTop: 'var(--spacing-sm)',
                fontSize: '0.9rem',
                color: 'var(--text-muted)'
            }}>
                <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Accueil</Link>
                <span style={{ margin: '0 8px' }}>/</span>
                <span>Nos Athl&egrave;tes</span>
            </div>

            {/* Page Title */}
            <h1 className="section-title" style={{ marginBottom: 'var(--spacing-lg)' }}>
                NOS ATHL&Egrave;TES
            </h1>

            {/* Hero Athlete Card */}
            <div className="athlete-hero">
                <div className="athlete-hero-image">
                    <img
                        src={athlete.image}
                        alt={athlete.name}
                        onError={(e) => {
                            e.target.src = 'https://placehold.co/500x600/1D3557/ffffff?text=Kohei+Uchimura';
                        }}
                    />
                    <div className="athlete-hero-overlay">
                        <span className="athlete-tag">Athl&egrave;te Gymnova</span>
                    </div>
                </div>

                <div className="athlete-hero-info">
                    <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                        <span style={{
                            fontSize: '0.85rem',
                            color: 'var(--primary)',
                            fontFamily: 'var(--font-heading)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}>
                            {athlete.flag} {athlete.nationality}
                        </span>
                    </div>

                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        lineHeight: '1.1',
                        marginBottom: '4px'
                    }}>
                        {athlete.name}
                    </h2>

                    <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.3rem',
                        color: 'var(--gold)',
                        marginBottom: 'var(--spacing-md)'
                    }}>
                        &laquo; {athlete.nickname} &raquo;
                    </div>

                    {/* Quote */}
                    <blockquote className="athlete-quote">
                        &ldquo;{athlete.quote}&rdquo;
                    </blockquote>

                    <p style={{
                        color: 'var(--text-light)',
                        lineHeight: '1.7',
                        marginBottom: 'var(--spacing-lg)',
                        fontSize: '1.05rem'
                    }}>
                        {athlete.bio}
                    </p>

                    {/* Stats Grid */}
                    <div className="athlete-stats-grid">
                        {athlete.stats.map((stat, index) => (
                            <div key={index} className="athlete-stat-card">
                                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{stat.icon}</div>
                                <div className="athlete-stat-value">{stat.value}</div>
                                <div className="athlete-stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Fiche Technique */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--spacing-lg)',
                marginTop: 'var(--spacing-xl)'
            }}>
                {/* Info Personnelle */}
                <div className="page-panel">
                    <h3 className="page-panel-heading">FICHE TECHNIQUE</h3>
                    <div className="athlete-info-grid">
                        <div className="athlete-info-row">
                            <span className="athlete-info-label">Nom complet</span>
                            <span className="athlete-info-value">{athlete.name}</span>
                        </div>
                        <div className="athlete-info-row">
                            <span className="athlete-info-label">Date de naissance</span>
                            <span className="athlete-info-value">{athlete.born}</span>
                        </div>
                        <div className="athlete-info-row">
                            <span className="athlete-info-label">Lieu de naissance</span>
                            <span className="athlete-info-value">{athlete.birthplace}</span>
                        </div>
                        <div className="athlete-info-row">
                            <span className="athlete-info-label">Nationalit&eacute;</span>
                            <span className="athlete-info-value">{athlete.flag} {athlete.nationality}</span>
                        </div>
                        <div className="athlete-info-row">
                            <span className="athlete-info-label">Taille</span>
                            <span className="athlete-info-value">{athlete.height}</span>
                        </div>
                        <div className="athlete-info-row">
                            <span className="athlete-info-label">Poids</span>
                            <span className="athlete-info-value">{athlete.weight}</span>
                        </div>
                        <div className="athlete-info-row">
                            <span className="athlete-info-label">Discipline</span>
                            <span className="athlete-info-value">{athlete.discipline}</span>
                        </div>
                        <div className="athlete-info-row">
                            <span className="athlete-info-label">Sp&eacute;cialit&eacute;</span>
                            <span className="athlete-info-value">{athlete.speciality}</span>
                        </div>
                        <div className="athlete-info-row">
                            <span className="athlete-info-label">Club</span>
                            <span className="athlete-info-value">{athlete.club}</span>
                        </div>
                        <div className="athlete-info-row">
                            <span className="athlete-info-label">Coach</span>
                            <span className="athlete-info-value">{athlete.coach}</span>
                        </div>
                        <div className="athlete-info-row">
                            <span className="athlete-info-label">Carri&egrave;re</span>
                            <span className="athlete-info-value">{athlete.yearsActive}</span>
                        </div>
                    </div>
                </div>

                {/* Disciplines / Equipment */}
                <div>
                    <div className="page-panel" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <h3 className="page-panel-heading">AGR&Egrave;S PRATIQU&Eacute;S</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                            {athlete.equipment.map((equip, index) => (
                                <span key={index} className="athlete-equip-tag">
                                    {equip}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="page-panel">
                        <h3 className="page-panel-heading">
                            &Eacute;QUIPEMENT GYMNOVA
                        </h3>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.7', marginBottom: 'var(--spacing-md)' }}>
                            Kohei Uchimura s'entra&icirc;ne et comp&eacute;titionne sur des &eacute;quipements Gymnova homologu&eacute;s FIG,
                            les m&ecirc;mes que vous retrouvez dans notre catalogue.
                        </p>
                        <Link to="/products" className="btn btn-primary" style={{ display: 'inline-block' }}>
                            D&eacute;couvrir nos produits
                        </Link>
                    </div>
                </div>
            </div>

            {/* Palmar&egrave;s */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <h2 className="section-title">PALMAR&Egrave;S</h2>

                {athlete.palmares.map((category, catIndex) => (
                    <div key={catIndex} className="page-panel" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <h3 className="page-panel-heading">{category.event}</h3>
                        <div className="athlete-palmares-list">
                            {category.details.map((item, index) => (
                                <div key={index} className="athlete-palmares-row">
                                    <span className="athlete-palmares-medal">
                                        {getMedalEmoji(item.medal)}
                                    </span>
                                    <span className="athlete-palmares-year">{item.year}</span>
                                    <span className="athlete-palmares-result">{item.result}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div style={{
                textAlign: 'center',
                marginTop: 'var(--spacing-xl)',
                marginBottom: 'var(--spacing-xl)'
            }}>
                <p style={{
                    fontSize: '1.3rem',
                    color: 'var(--text-light)',
                    marginBottom: 'var(--spacing-md)'
                }}>
                    Entra&icirc;nez-vous avec le m&ecirc;me &eacute;quipement que les champions
                </p>
                <Link to="/products" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
                    Voir notre catalogue
                </Link>
            </div>
        </div>
    );
};

export default Athletes;
