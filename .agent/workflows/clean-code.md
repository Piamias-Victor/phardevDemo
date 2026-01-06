---
description: Analyse et refactorise tout le code du projet. Clean code, optimisations, best practices, scalabilité. Lance avec /clean-code
---

---

## description: Analyse et refactorise tout le code du projet. Clean code, optimisations, best practices, scalabilité. Lance avec /clean-code

# Workflow: Clean Code & Refacto

## Mission

Analyse complète du codebase et refactorisation pour atteindre un niveau de qualité production premium.

## Checklist d'analyse

### 1. Architecture & Structure

- [ ] Vérifier que chaque fichier est au bon endroit selon la structure définie
- [ ] Identifier le code dupliqué → extraire en composants/hooks/utils
- [ ] Vérifier la séparation des responsabilités (components vs hooks vs utils)
- [ ] S'assurer que les composants sont suffisamment atomiques
- [ ] Vérifier les barrel exports (index.ts) pour chaque dossier

### 2. TypeScript

- [ ] Aucun `any` dans le code
- [ ] Toutes les props typées avec interfaces
- [ ] Types exportés depuis `/types`
- [ ] Generics utilisés quand pertinent
- [ ] Strict mode respecté

### 3. React Best Practices

- [ ] Pas de Class components
- [ ] useCallback sur les fonctions passées en props
- [ ] useMemo sur les calculs coûteux
- [ ] Keys uniques et stables sur les listes
- [ ] Pas de logique métier dans les composants → extraire en hooks
- [ ] Lazy loading sur les composants lourds (3D, sections below fold)

### 4. Performance

- [ ] Pas de re-renders inutiles (React DevTools Profiler)
- [ ] Images optimisées (next/image, WebP, srcset)
- [ ] Fonts optimisées (subset, preload, display=swap)
- [ ] Code splitting effectif
- [ ] Pas d'imports inutiles
- [ ] Tree shaking vérifié

### 5. CSS / Tailwind

- [ ] Pas de styles inline (sauf dynamiques)
- [ ] Classes Tailwind ordonnées (plugin Prettier)
- [ ] Pas de classes dupliquées
- [ ] Variables CSS pour les tokens
- [ ] Responsive cohérent (mobile-first)

### 6. Animations (GSAP / Framer Motion)

- [ ] Toutes les animations ont un cleanup dans useEffect
- [ ] ScrollTrigger.kill() appelé au unmount
- [ ] prefers-reduced-motion respecté
- [ ] Pas d'animations bloquantes sur mobile
- [ ] Performance 60fps vérifiée

### 7. Three.js / R3F

- [ ] Suspense avec fallback sur tous les Canvas
- [ ] DPR limité sur mobile
- [ ] Dispose() appelé sur les géométries/matériaux
- [ ] useFrame optimisé (pas de créations d'objets)
- [ ] Post-processing conditionnel selon device

### 8. Clean Code

- [ ] Nommage clair et cohérent
- [ ] Fonctions < 30 lignes
- [ ] Composants < 150 lignes
- [ ] Pas de magic numbers → constantes nommées
- [ ] Pas de console.log
- [ ] Pas de code commenté
- [ ] Pas de TODO non traités

### 9. Scalabilité

- [ ] Composants facilement réutilisables
- [ ] Props flexibles avec bonnes valeurs par défaut
- [ ] Hooks génériques
- [ ] Store Zustand bien structuré (slices si besoin)
- [ ] Constantes et configs centralisées

## Actions à effectuer

1. **Scanner** tout le codebase
2. **Lister** tous les problèmes trouvés par catégorie
3. **Prioriser** : critiques → importants → nice-to-have
4. **Refactoriser** fichier par fichier
5. **Tester** que rien n'est cassé après chaque refacto
6. **Documenter** les changements majeurs

## Output attendu

- Code propre, lisible, maintenable
- Zéro warning TypeScript/ESLint
- Performance optimisée
- Prêt pour scale et ajout de features
