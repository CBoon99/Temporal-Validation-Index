#!/usr/bin/env python3
"""
Temporal Validation Framework - Complete Experimental Code
==========================================================
Author: Carl van der Linden
Date: January 2026
License: MIT

This module provides the complete implementation of the Temporal Validation
Framework, including:
- TVI (True Viral Impact) calculation
- ISPS (Investment Staying Power Score) calculation
- TDIS (Training Data Impact Score) calculation
- Fractal dimension estimation
- Crisis survival backtesting
- Civilization survival simulation

Repository: https://github.com/temporal-validation/framework
Calculator: https://temporal-engine.netlify.app
"""

import numpy as np
import pandas as pd
from scipy import stats
from dataclasses import dataclass
from typing import List, Dict, Tuple, Optional
from datetime import datetime
import json
import warnings
warnings.filterwarnings('ignore')


# =============================================================================
# CONSTANTS AND CONFIGURATION
# =============================================================================

# Structural Resistance Coefficients by Era
SRC_TABLE = {
    (1900, 1950): 3.5,
    (1950, 1980): 3.0,
    (1980, 1996): 2.8,
    (1996, 2005): 3.0,  # Pre-platform, manual distribution
    (2005, 2010): 2.5,  # Early platform era
    (2010, 2014): 2.0,  # Platform growth era
    (2014, 2018): 1.5,  # Mature platforms
    (2018, 2030): 1.0,  # Algorithmic distribution
}

# TVI Classification Thresholds
TVI_TIERS = {
    'ephemeral': (0, 1.0),
    'viral_moment': (1.0, 5.0),
    'cultural_event': (5.0, 15.0),
    'cultural_milestone': (15.0, 30.0),
    'foundation': (30.0, 50.0),
    'historical_phenomenon': (50.0, float('inf'))
}

# ISPS Classification Thresholds
ISPS_TIERS = {
    'ephemeral_hype': (0, 5.0),
    'trend_riding': (5.0, 20.0),
    'validated_position': (20.0, 50.0),
    'foundation_investment': (50.0, 1000.0),
    'superfoundation': (1000.0, float('inf'))
}


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def get_src(year: int) -> float:
    """Get Structural Resistance Coefficient for a given year."""
    for (start, end), src in SRC_TABLE.items():
        if start <= year < end:
            return src
    return 1.0  # Default for years outside defined ranges


def classify_tvi(score: float) -> str:
    """Classify a TVI score into its tier."""
    for tier, (low, high) in TVI_TIERS.items():
        if low <= score < high:
            return tier
    return 'unknown'


def classify_isps(score: float) -> str:
    """Classify an ISPS score into its tier."""
    for tier, (low, high) in ISPS_TIERS.items():
        if low <= score < high:
            return tier
    return 'unknown'


# =============================================================================
# CORE TVI CALCULATION
# =============================================================================

@dataclass
class TVIResult:
    """Result of a TVI calculation."""
    score: float
    saturation: float
    tvs: float
    src: float
    tier: str
    components: Dict


def calculate_tvi(
    views: int,
    year: int,
    platform_users: int,
    persistence_months: int,
    resurfacing_rate: float = 0.0,
    legacy_level: float = 1.0,
    cross_platform: float = 1.0,
    account_factor: float = None,
    current_year: int = 2026
) -> TVIResult:
    """
    Calculate True Viral Impact (TVI) score.
    
    Parameters
    ----------
    views : int
        Total view count
    year : int
        Year of initial virality
    platform_users : int
        Active users on platform at time of virality
    persistence_months : int
        Months of continued relevance (capped at 180)
    resurfacing_rate : float
        Average resurfacing events per year (0.0 - 1.0+)
    legacy_level : float
        Legacy classification (1.0 = baseline, 2.0 = reference, 3.0 = historical)
    cross_platform : float
        Cross-platform spread coefficient (1.0 = single platform, 3.5+ = universal)
    account_factor : float, optional
        Account multiplication factor. If None, calculated from year.
    current_year : int
        Current year for calculations
    
    Returns
    -------
    TVIResult
        Complete TVI calculation result
    """
    # Calculate Account Factor if not provided
    if account_factor is None:
        years_old = current_year - year
        if year < 2005:
            account_factor = 1.0
        elif years_old < 1:
            account_factor = 1.1
        elif years_old < 5:
            account_factor = 1.5
        elif years_old < 10:
            account_factor = 2.0
        elif years_old < 15:
            account_factor = 2.3
        else:
            account_factor = 2.5
    
    # Calculate Saturation Index
    # S = (Views / A) / U × C
    saturation = (views / account_factor) / platform_users * cross_platform
    
    # Calculate Temporal Validation Score
    # TVS = P × R × L (capped at 180 months)
    P = min(persistence_months, 180)
    tvs = P * (resurfacing_rate + 0.1) * legacy_level  # +0.1 baseline
    
    # Get Structural Resistance Coefficient
    src = get_src(year)
    
    # Calculate TVI
    # TVI = S × log₁₀(TVS + 1) × SRC
    tvi_score = saturation * np.log10(tvs + 1) * src
    
    return TVIResult(
        score=round(tvi_score, 2),
        saturation=round(saturation, 4),
        tvs=round(tvs, 2),
        src=src,
        tier=classify_tvi(tvi_score),
        components={
            'views': views,
            'year': year,
            'platform_users': platform_users,
            'account_factor': account_factor,
            'persistence_months': persistence_months,
            'resurfacing_rate': resurfacing_rate,
            'legacy_level': legacy_level,
            'cross_platform': cross_platform
        }
    )


# =============================================================================
# ISPS CALCULATION
# =============================================================================

@dataclass
class ISPSResult:
    """Result of an ISPS calculation."""
    score: float
    saturation: float
    tvs: float
    src: float
    tier: str
    survival_prediction: str
    components: Dict


def calculate_isps(
    brand_awareness: float,
    market_position: int,
    founding_year: int,
    crisis_survival_score: int = 0,
    leadership_continuity: float = 1.0,
    cross_asset: float = 1.0,
    ecosystem_factor: float = 1.0
) -> ISPSResult:
    """
    Calculate Investment Staying Power Score (ISPS).
    
    Parameters
    ----------
    brand_awareness : float
        Brand recognition (0.0 - 1.0)
    market_position : int
        Market position strength (1-10 scale)
    founding_year : int
        Year company was founded
    crisis_survival_score : int
        Number of major crises survived (0-5)
    leadership_continuity : float
        Leadership stability factor (0.5 - 2.0)
    cross_asset : float
        Cross-asset class presence (1.0 - 3.0)
    ecosystem_factor : float
        Ecosystem dependency factor (0.5 - 2.0)
    
    Returns
    -------
    ISPSResult
        Complete ISPS calculation result
    """
    # Calculate Saturation (market presence)
    # S = (Brand × Position) / Ecosystem × Cross_Asset × 100
    saturation = (brand_awareness * market_position) / ecosystem_factor * cross_asset * 100
    
    # Calculate TVS proxy
    # TVS = Crisis_Survival × 50 + Age × 0.5
    current_year = 2026
    company_age = current_year - founding_year
    tvs = crisis_survival_score * 50 + company_age * 0.5 * leadership_continuity
    
    # Get SRC
    src = get_src(founding_year)
    
    # Calculate ISPS
    isps_score = saturation * np.log10(tvs + 1) * src
    
    # Survival prediction
    if isps_score < 20:
        prediction = "HIGH RISK - Likely to collapse in crisis"
    elif isps_score < 50:
        prediction = "UNCERTAIN - May survive with adaptation"
    elif isps_score < 200:
        prediction = "STABLE - Likely to survive crisis"
    else:
        prediction = "FOUNDATION - Expected to thrive through crisis"
    
    return ISPSResult(
        score=round(isps_score, 2),
        saturation=round(saturation, 4),
        tvs=round(tvs, 2),
        src=src,
        tier=classify_isps(isps_score),
        survival_prediction=prediction,
        components={
            'brand_awareness': brand_awareness,
            'market_position': market_position,
            'founding_year': founding_year,
            'crisis_survival_score': crisis_survival_score,
            'leadership_continuity': leadership_continuity,
            'cross_asset': cross_asset,
            'ecosystem_factor': ecosystem_factor
        }
    )


# =============================================================================
# TDIS CALCULATION (Training Data Impact Score)
# =============================================================================

@dataclass
class TDISResult:
    """Result of a TDIS calculation."""
    score: float
    tier: str
    recommendation: str


def calculate_tdis(
    citations: int,
    usage_score: float,
    release_year: int,
    researcher_population: int,
    cross_framework: float = 1.0
) -> TDISResult:
    """
    Calculate Training Data Impact Score (TDIS).
    
    Parameters
    ----------
    citations : int
        Academic citations
    usage_score : float
        Normalized usage in production (0.0 - 1.0)
    release_year : int
        Year dataset was released
    researcher_population : int
        Size of relevant researcher community at release
    cross_framework : float
        Cross-framework adoption (1.0 - 3.0)
    
    Returns
    -------
    TDISResult
        Complete TDIS calculation result
    """
    current_year = 2026
    persistence = (current_year - release_year) * 12  # months
    
    # Saturation
    saturation = (citations * usage_score) / researcher_population * cross_framework * 1000
    
    # TVS
    tvs = min(persistence, 180) * 0.5
    
    # SRC
    src = get_src(release_year)
    
    # TDIS
    tdis_score = saturation * np.log10(tvs + 1) * src
    
    # Recommendation
    if tdis_score > 1000:
        recommendation = "FOUNDATIONAL - Essential for training"
    elif tdis_score > 100:
        recommendation = "STANDARD - Recommended for benchmarking"
    elif tdis_score > 10:
        recommendation = "USEFUL - Consider for specialized tasks"
    else:
        recommendation = "EPHEMERAL - Avoid for long-term projects"
    
    return TDISResult(
        score=round(tdis_score, 2),
        tier=classify_tvi(tdis_score),  # Reuse TVI tiers
        recommendation=recommendation
    )


# =============================================================================
# FRACTAL DIMENSION ANALYSIS
# =============================================================================

def calculate_hurst_exponent(series: np.ndarray, max_lag: int = 100) -> Tuple[float, float]:
    """
    Calculate Hurst exponent using R/S (rescaled range) analysis.
    
    Parameters
    ----------
    series : np.ndarray
        Time series data
    max_lag : int
        Maximum lag to consider
    
    Returns
    -------
    Tuple[float, float]
        (Hurst exponent, R-squared of fit)
    """
    n = len(series)
    if n < max_lag * 2:
        max_lag = n // 4
    
    lags = range(10, max_lag)
    rs_values = []
    
    for lag in lags:
        # Divide into subseries
        subseries = [series[i:i+lag] for i in range(0, n-lag, lag)]
        
        rs_lag = []
        for sub in subseries:
            if len(sub) < 2:
                continue
            # Mean-adjusted series
            mean_adj = sub - np.mean(sub)
            # Cumulative deviation
            cumdev = np.cumsum(mean_adj)
            # Range
            R = np.max(cumdev) - np.min(cumdev)
            # Standard deviation
            S = np.std(sub, ddof=1)
            if S > 0:
                rs_lag.append(R / S)
        
        if rs_lag:
            rs_values.append((lag, np.mean(rs_lag)))
    
    if len(rs_values) < 5:
        return None, None
    
    # Log-log regression
    lags_arr = np.log([x[0] for x in rs_values])
    rs_arr = np.log([x[1] for x in rs_values])
    
    slope, intercept, r_value, p_value, std_err = stats.linregress(lags_arr, rs_arr)
    
    return slope, r_value ** 2


def estimate_fractal_dimension(series: np.ndarray) -> Dict:
    """
    Estimate fractal dimension of a time series.
    
    Parameters
    ----------
    series : np.ndarray
        Time series data
    
    Returns
    -------
    Dict
        Dictionary containing H, D, R², and interpretation
    """
    H, r_squared = calculate_hurst_exponent(series)
    
    if H is None:
        return {'error': 'Insufficient data for analysis'}
    
    D = 2 - H
    
    # Interpretation
    if D < 1.5:
        interpretation = "Persistent/trending (memory effects)"
    elif D < 1.6:
        interpretation = "Slightly persistent"
    elif D < 1.8:
        interpretation = "Edge of chaos (optimal complexity)"
    elif D < 1.9:
        interpretation = "Slightly anti-persistent"
    else:
        interpretation = "Anti-persistent/mean-reverting"
    
    return {
        'hurst_exponent': round(H, 4),
        'fractal_dimension': round(D, 4),
        'r_squared': round(r_squared, 4),
        'interpretation': interpretation,
        'matches_prediction': abs(D - 1.7) < 0.15
    }


def generate_cultural_timeseries(n: int = 2000, seed: int = None) -> np.ndarray:
    """
    Generate synthetic cultural attention time series.
    
    Model: Exponential decay with power-law distributed bursts.
    
    Parameters
    ----------
    n : int
        Length of time series
    seed : int, optional
        Random seed for reproducibility
    
    Returns
    -------
    np.ndarray
        Synthetic cultural time series
    """
    if seed is not None:
        np.random.seed(seed)
    
    series = np.zeros(n)
    
    for i in range(1, n):
        # Base decay
        series[i] = 0.95 * series[i-1]
        
        # Power-law distributed bursts (2% probability)
        if np.random.random() < 0.02:
            burst_size = np.random.pareto(1.5) * 10
            series[i] += burst_size
        
        # Background noise
        series[i] += np.random.randn() * 0.5
        
        # Floor at zero
        series[i] = max(0, series[i])
    
    return series


# =============================================================================
# ISPS BACKTESTING
# =============================================================================

def backtest_isps() -> pd.DataFrame:
    """
    Backtest ISPS against historical crisis survival data.
    
    Returns
    -------
    pd.DataFrame
        Backtest results with predictions and outcomes
    """
    # Historical data: (Name, Founded, Brand, Position, Crises, Survived, Outcome)
    companies = [
        # 2008 Financial Crisis
        ('Lehman Brothers', 1850, 0.70, 6, 0, False, 'Collapsed'),
        ('Bear Stearns', 1923, 0.65, 5, 0, False, 'Collapsed'),
        ('Washington Mutual', 1889, 0.55, 4, 0, False, 'Collapsed'),
        ('AIG', 1919, 0.75, 7, 0, False, 'Bailout'),
        ('Countrywide', 1969, 0.50, 4, 0, False, 'Collapsed'),
        ('Goldman Sachs', 1869, 0.80, 8, 2, True, 'Survived'),
        ('JPMorgan', 1871, 0.85, 9, 3, True, 'Thrived'),
        ('Apple', 1976, 0.95, 10, 3, True, 'Thrived'),
        ('Microsoft', 1975, 0.92, 9, 2, True, 'Survived'),
        ('Walmart', 1962, 0.90, 9, 3, True, 'Thrived'),
        ('General Motors', 1908, 0.85, 7, 1, False, 'Bankruptcy'),
        ('Circuit City', 1949, 0.60, 5, 0, False, 'Liquidated'),
        
        # COVID-19 Era
        ('Peloton', 2012, 0.60, 5, 0, False, '-85%'),
        ('WeWork', 2010, 0.55, 4, 0, False, 'Near collapse'),
        ('Amazon', 1994, 0.95, 10, 4, True, 'Thrived'),
        ('Netflix', 1997, 0.85, 8, 2, True, 'Survived'),
    ]
    
    results = []
    for name, founded, brand, position, crises, survived, outcome in companies:
        isps_result = calculate_isps(
            brand_awareness=brand,
            market_position=position,
            founding_year=founded,
            crisis_survival_score=crises
        )
        
        # Prediction accuracy
        predicted_survive = isps_result.score >= 50
        correct = predicted_survive == survived
        
        results.append({
            'Company': name,
            'Founded': founded,
            'ISPS': isps_result.score,
            'Tier': isps_result.tier,
            'Predicted': 'Survive' if predicted_survive else 'At Risk',
            'Actual': 'Survived' if survived else 'Failed',
            'Outcome': outcome,
            'Correct': correct
        })
    
    return pd.DataFrame(results)


# =============================================================================
# CIVILIZATION SURVIVAL SIMULATION
# =============================================================================

def simulate_civilization_survival(
    n_civilizations: int = 200,
    max_years: int = 500,
    tau_distribution: Dict[str, float] = None,
    seed: int = None
) -> Dict:
    """
    Simulate civilization survival based on τ (temporal horizon) distribution.
    
    Parameters
    ----------
    n_civilizations : int
        Number of civilizations to simulate
    max_years : int
        Maximum simulation years
    tau_distribution : Dict[str, float]
        Distribution of temporal thinking horizons
    seed : int, optional
        Random seed
    
    Returns
    -------
    Dict
        Simulation results
    """
    if seed is not None:
        np.random.seed(seed)
    
    if tau_distribution is None:
        tau_distribution = {
            'quarterly': 0.70,
            'decadal': 0.25,
            'generational': 0.04,
            'civilizational': 0.01
        }
    
    lifespans = []
    
    for _ in range(n_civilizations):
        years = 0
        alive = True
        
        while alive and years < max_years:
            years += 1
            
            # Short-term threat (annual, 10% probability)
            if np.random.random() < 0.10:
                if tau_distribution['quarterly'] < 0.30:
                    if np.random.random() < 0.30:
                        alive = False
            
            # Medium-term threat (decadal, 2% probability)
            if alive and np.random.random() < 0.02:
                medium_thinkers = (tau_distribution['decadal'] + 
                                   tau_distribution['generational'] + 
                                   tau_distribution['civilizational'])
                if medium_thinkers < 0.20:
                    if np.random.random() < 0.50:
                        alive = False
            
            # Century-scale threat (every 50 years, 30% probability)
            if alive and years % 50 == 0:
                if np.random.random() < 0.30:
                    if tau_distribution['civilizational'] < 0.10:
                        if np.random.random() < 0.70:
                            alive = False
        
        lifespans.append(years)
    
    return {
        'tau_distribution': tau_distribution,
        'civilizational_pct': tau_distribution['civilizational'] * 100,
        'avg_lifespan': np.mean(lifespans),
        'median_lifespan': np.median(lifespans),
        'survival_500y': sum(1 for l in lifespans if l >= 500) / n_civilizations * 100,
        'survival_250y': sum(1 for l in lifespans if l >= 250) / n_civilizations * 100,
        'min_lifespan': min(lifespans),
        'max_lifespan': max(lifespans)
    }


def run_civilization_experiment(seed: int = 42) -> pd.DataFrame:
    """
    Run complete civilization survival experiment with multiple τ distributions.
    
    Returns
    -------
    pd.DataFrame
        Results for all tested distributions
    """
    distributions = [
        ('Current Humanity (1%)', {'quarterly': 0.70, 'decadal': 0.25, 'generational': 0.04, 'civilizational': 0.01}),
        ('5% Civilizational', {'quarterly': 0.60, 'decadal': 0.28, 'generational': 0.07, 'civilizational': 0.05}),
        ('10% Civilizational', {'quarterly': 0.50, 'decadal': 0.30, 'generational': 0.10, 'civilizational': 0.10}),
        ('20% Civilizational', {'quarterly': 0.30, 'decadal': 0.30, 'generational': 0.20, 'civilizational': 0.20}),
    ]
    
    results = []
    for name, dist in distributions:
        result = simulate_civilization_survival(
            n_civilizations=200,
            max_years=500,
            tau_distribution=dist,
            seed=seed
        )
        result['Distribution'] = name
        results.append(result)
    
    return pd.DataFrame(results)


# =============================================================================
# MEMORY HALF-LIFE ANALYSIS
# =============================================================================

def simulate_memory_decay(n_items: int = 10000, seed: int = 42) -> pd.DataFrame:
    """
    Simulate cultural memory decay by TVI tier.
    
    Returns
    -------
    pd.DataFrame
        Decay analysis results
    """
    np.random.seed(seed)
    
    # Generate power-law distributed TVI scores
    tvi_scores = np.random.pareto(1.5, n_items) * 2
    
    # Assign half-lives by tier
    half_lives = np.zeros(n_items)
    for i, tvi in enumerate(tvi_scores):
        if tvi < 1:
            half_lives[i] = 11  # 11 days
        elif tvi < 5:
            half_lives[i] = 180  # 6 months
        elif tvi < 15:
            half_lives[i] = 365 * 4.2  # 4.2 years
        elif tvi < 30:
            half_lives[i] = 365 * 10  # 10 years
        else:
            half_lives[i] = 365 * 25  # 25 years
    
    results = []
    checkpoints = [7, 30, 47, 90, 180, 365, 365*2, 365*5, 365*10]
    
    for t in checkpoints:
        memory_remaining = 0.5 ** (t / half_lives)
        
        for tier_name, (low, high) in [
            ('Ephemeral', (0, 1)),
            ('Viral', (1, 5)),
            ('Cultural', (5, 15)),
            ('Milestone', (15, 30)),
            ('Foundation', (30, float('inf')))
        ]:
            mask = (tvi_scores >= low) & (tvi_scores < high)
            if mask.sum() > 0:
                retention = (memory_remaining[mask] > 0.1).mean() * 100
                results.append({
                    'Days': t,
                    'Tier': tier_name,
                    'Retention %': round(retention, 1),
                    'Sample Size': mask.sum()
                })
    
    return pd.DataFrame(results)


# =============================================================================
# POWER LAW ANALYSIS
# =============================================================================

def analyze_power_law(n_items: int = 100000, seed: int = 42) -> Dict:
    """
    Analyze power law distribution in cultural memory allocation.
    
    Returns
    -------
    Dict
        Power law analysis results
    """
    np.random.seed(seed)
    
    # Generate power-law TVI scores
    tvi_scores = np.random.pareto(1.5, n_items) * 2
    
    # Memory weight = TVI × log(TVI + 1)
    memory_weight = tvi_scores * np.log10(tvi_scores + 1)
    total = memory_weight.sum()
    
    # Top 0.1%
    threshold_top = np.percentile(tvi_scores, 99.9)
    top_share = memory_weight[tvi_scores >= threshold_top].sum() / total
    
    # Bottom 90%
    threshold_bottom = np.percentile(tvi_scores, 90)
    bottom_share = memory_weight[tvi_scores <= threshold_bottom].sum() / total
    
    # Top 20% (Pareto check)
    threshold_20 = np.percentile(tvi_scores, 80)
    top_20_share = memory_weight[tvi_scores >= threshold_20].sum() / total
    
    return {
        'n_items': n_items,
        'top_0.1%_share': round(top_share * 100, 1),
        'bottom_90%_share': round(bottom_share * 100, 1),
        'top_20%_share': round(top_20_share * 100, 1),
        'pareto_ratio': round(top_20_share / 0.80, 2),
        'gini_coefficient': round(1 - 2 * bottom_share, 3)
    }


# =============================================================================
# COMPLETE EXPERIMENT RUNNER
# =============================================================================

def run_all_experiments(seed: int = 42, verbose: bool = True) -> Dict:
    """
    Run all experiments and return complete results.
    
    Parameters
    ----------
    seed : int
        Random seed for reproducibility
    verbose : bool
        Print results to console
    
    Returns
    -------
    Dict
        Complete experimental results
    """
    results = {}
    
    # 1. Fractal Dimension
    if verbose:
        print("=" * 70)
        print("EXPERIMENT 1: FRACTAL DIMENSION ESTIMATION")
        print("=" * 70)
    
    cultural_series = generate_cultural_timeseries(n=2000, seed=seed)
    fractal_results = estimate_fractal_dimension(cultural_series)
    results['fractal_dimension'] = fractal_results
    
    if verbose:
        print(f"Hurst Exponent (H): {fractal_results['hurst_exponent']}")
        print(f"Fractal Dimension (D): {fractal_results['fractal_dimension']}")
        print(f"R²: {fractal_results['r_squared']}")
        print(f"Prediction (D ≈ 1.7): {'✓ CONFIRMED' if fractal_results['matches_prediction'] else '✗ REJECTED'}")
    
    # 2. ISPS Backtest
    if verbose:
        print("\n" + "=" * 70)
        print("EXPERIMENT 2: ISPS CRISIS PREDICTION BACKTEST")
        print("=" * 70)
    
    isps_results = backtest_isps()
    accuracy = isps_results['Correct'].mean() * 100
    results['isps_backtest'] = {
        'data': isps_results.to_dict('records'),
        'accuracy': round(accuracy, 1),
        'n_companies': len(isps_results)
    }
    
    if verbose:
        print(isps_results[['Company', 'ISPS', 'Predicted', 'Actual', 'Correct']].to_string(index=False))
        print(f"\nOverall Accuracy: {accuracy:.1f}%")
    
    # 3. Civilization Survival
    if verbose:
        print("\n" + "=" * 70)
        print("EXPERIMENT 3: CIVILIZATION SURVIVAL SIMULATION")
        print("=" * 70)
    
    civ_results = run_civilization_experiment(seed=seed)
    results['civilization_survival'] = civ_results.to_dict('records')
    
    if verbose:
        print(civ_results[['Distribution', 'civilizational_pct', 'avg_lifespan', 'survival_500y']].to_string(index=False))
    
    # 4. Memory Half-Life
    if verbose:
        print("\n" + "=" * 70)
        print("EXPERIMENT 4: MEMORY HALF-LIFE BY TVI TIER")
        print("=" * 70)
    
    memory_results = simulate_memory_decay(seed=seed)
    results['memory_decay'] = memory_results.to_dict('records')
    
    if verbose:
        # Show key checkpoints
        for tier in ['Ephemeral', 'Foundation']:
            tier_data = memory_results[memory_results['Tier'] == tier]
            print(f"\n{tier} content:")
            for _, row in tier_data.iterrows():
                print(f"  Day {row['Days']:>4}: {row['Retention %']:>5.1f}% retained")
    
    # 5. Power Law Analysis
    if verbose:
        print("\n" + "=" * 70)
        print("EXPERIMENT 5: POWER LAW DISTRIBUTION")
        print("=" * 70)
    
    power_law_results = analyze_power_law(seed=seed)
    results['power_law'] = power_law_results
    
    if verbose:
        print(f"Top 0.1% share of memory: {power_law_results['top_0.1%_share']}%")
        print(f"Bottom 90% share of memory: {power_law_results['bottom_90%_share']}%")
        print(f"Top 20% share: {power_law_results['top_20%_share']}% (Pareto predicts ~80%)")
    
    # Summary
    if verbose:
        print("\n" + "=" * 70)
        print("SUMMARY")
        print("=" * 70)
        print(f"Fractal Dimension: D = {fractal_results['fractal_dimension']} (predicted: 1.7)")
        print(f"ISPS Accuracy: {accuracy:.1f}%")
        print(f"10% Threshold Effect: {civ_results[civ_results['Distribution'].str.contains('10%')]['survival_500y'].values[0]:.0f}% survival")
    
    return results


# =============================================================================
# EXAMPLE CALCULATIONS
# =============================================================================

def example_calculations():
    """Demonstrate framework with classic examples."""
    
    print("=" * 70)
    print("EXAMPLE TVI CALCULATIONS")
    print("=" * 70)
    
    # Charlie Bit My Finger
    charlie = calculate_tvi(
        views=880_000_000,
        year=2007,
        platform_users=100_000_000,
        persistence_months=180,
        resurfacing_rate=0.65,
        legacy_level=3.0,
        cross_platform=3.5
    )
    print(f"\nCharlie Bit My Finger (2007):")
    print(f"  TVI Score: {charlie.score}")
    print(f"  Tier: {charlie.tier}")
    
    # Damn Daniel
    daniel = calculate_tvi(
        views=45_000_000,
        year=2016,
        platform_users=1_500_000_000,
        persistence_months=6,
        resurfacing_rate=0.1,
        legacy_level=1.0,
        cross_platform=2.0
    )
    print(f"\nDamn Daniel (2016):")
    print(f"  TVI Score: {daniel.score}")
    print(f"  Tier: {daniel.tier}")
    
    print("\n" + "=" * 70)
    print("EXAMPLE ISPS CALCULATIONS")
    print("=" * 70)
    
    # Apple
    apple = calculate_isps(
        brand_awareness=0.95,
        market_position=10,
        founding_year=1976,
        crisis_survival_score=4,
        leadership_continuity=1.5
    )
    print(f"\nApple:")
    print(f"  ISPS Score: {apple.score}")
    print(f"  Tier: {apple.tier}")
    print(f"  Prediction: {apple.survival_prediction}")
    
    # WeWork (2019)
    wework = calculate_isps(
        brand_awareness=0.55,
        market_position=4,
        founding_year=2010,
        crisis_survival_score=0,
        leadership_continuity=0.5
    )
    print(f"\nWeWork (2019):")
    print(f"  ISPS Score: {wework.score}")
    print(f"  Tier: {wework.tier}")
    print(f"  Prediction: {wework.survival_prediction}")
    
    print("\n" + "=" * 70)
    print("EXAMPLE TDIS CALCULATIONS")
    print("=" * 70)
    
    # MNIST
    mnist = calculate_tdis(
        citations=45000,
        usage_score=0.95,
        release_year=1998,
        researcher_population=50000,
        cross_framework=3.0
    )
    print(f"\nMNIST Dataset:")
    print(f"  TDIS Score: {mnist.score}")
    print(f"  Recommendation: {mnist.recommendation}")


# =============================================================================
# MAIN EXECUTION
# =============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("TEMPORAL VALIDATION FRAMEWORK - EXPERIMENTAL VALIDATION")
    print("Author: Carl van der Linden | January 2026")
    print("=" * 70 + "\n")
    
    # Run examples
    example_calculations()
    
    print("\n")
    
    # Run all experiments
    results = run_all_experiments(seed=42, verbose=True)
    
    # Save results to JSON
    # Convert numpy types for JSON serialization
    def convert_types(obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, pd.DataFrame):
            return obj.to_dict('records')
        return obj
    
    results_json = json.loads(
        json.dumps(results, default=convert_types)
    )
    
    with open('experimental_results.json', 'w') as f:
        json.dump(results_json, f, indent=2)
    
    print("\n" + "=" * 70)
    print("Results saved to experimental_results.json")
    print("=" * 70)
