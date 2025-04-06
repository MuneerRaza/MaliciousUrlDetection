import re
import math
import joblib
import requests
import warnings
import pandas as pd
from collections import Counter
from urllib.parse import urlparse
warnings.filterwarnings("ignore", category=UserWarning)


# Cache for known safe domains
SAFE_DOMAINS_CACHE = set()

def load_safe_domains():
    """Load safe domains from OpenDNS list and cache them"""
    global SAFE_DOMAINS_CACHE
    try:
        response = requests.get('https://raw.githubusercontent.com/opendns/public-domain-lists/master/opendns-top-domains.txt', timeout=5)
        if response.status_code == 200:
            domains = response.text.strip().split('\n')
            # Add domains and their www variants to the cache
            for domain in domains:
                domain = domain.lower().strip()
                if domain:
                    SAFE_DOMAINS_CACHE.add(domain)
                    SAFE_DOMAINS_CACHE.add(f"www.{domain}")
            
            # Add some additional common domains that might not be in the list
            common_domains = ["google.com", "youtube.com", "facebook.com", "twitter.com", "instagram.com",
                             "linkedin.com", "github.com", "microsoft.com", "apple.com", "amazon.com"]
            for domain in common_domains:
                SAFE_DOMAINS_CACHE.add(domain)
                SAFE_DOMAINS_CACHE.add(f"www.{domain}")
                
            print(f"Loaded {len(SAFE_DOMAINS_CACHE)} safe domains")
        else:
            print("Failed to load safe domains list")
    except Exception as e:
        print(f"Error loading safe domains: {e}")

def normalize_domain(url):
    """Extract and normalize domain from URL"""
    try:
        
        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        
        # Remove port if present
        if ':' in domain:
            domain = domain.split(':')[0]
            
        # Remove 'www.' if present
        if domain.startswith('www.'):
            domain = domain[4:]
            
        return domain
    except:
        return ""

def get_feature_names():
    """Return the names of all features that will be extracted"""
    # This ensures consistency between training and prediction
    feature_names = [
        'url_length', 'domain_length', 'is_common_domain', 'subdomain_count',
        'path_length', 'path_depth', 'has_query', 'query_length',
        'query_params_count', 'has_fragment', 'has_ip_address',
        'has_suspicious_tld', 'has_multiple_dots', 'has_multiple_subdomains',
        'digit_ratio', 'letter_ratio', 'uppercase_ratio', 'lowercase_ratio',
        'entropy', 'tld_length', 'is_common_tld', 'suspicious_words_count',
        'max_consecutive_digits', 'max_consecutive_letters'
    ]
    
    # Add special character counts
    special_chars = ['@', '-', '_', '=', '&', ';', ':', '/', '?', '.', '%', '~', '#', '+']
    for char in special_chars:
        feature_names.append(f'count_{char}')
        
    return feature_names

def extract_url_features(url):
    """Extract comprehensive features from URL for classification"""
    features = {}
    
    try:
        # Handle empty or non-string URLs
        if not isinstance(url, str) or not url:
            return {feature_name: 0 for feature_name in get_feature_names()}

        # add scheme if missing
        if not url.startswith('http://') and not url.startswith('https://'):
            url = 'http://' + url

        features['url_length'] = len(url)

        
        parsed = urlparse(url)
        domain = parsed.netloc
        path = parsed.path
        query = parsed.query
        fragment = parsed.fragment
        
        # Domain features
        features['domain_length'] = len(domain)
        normalized_domain = normalize_domain(url)
        features['is_common_domain'] = 1 if normalized_domain in SAFE_DOMAINS_CACHE or f"www.{normalized_domain}" in SAFE_DOMAINS_CACHE else 0
        
        # Subdomain features
        domain_parts = domain.split('.')
        features['subdomain_count'] = len(domain_parts) - 2 if len(domain_parts) > 2 else 0
        
        # Path features
        features['path_length'] = len(path)
        features['path_depth'] = path.count('/') if path else 0
        
        # Query and fragment features
        features['has_query'] = 1 if query else 0
        features['query_length'] = len(query)
        features['query_params_count'] = query.count('&') + 1 if query else 0
        features['has_fragment'] = 1 if fragment else 0
        
        # Special character counts
        special_chars = ['@', '-', '_', '=', '&', ';', ':', '/', '?', '.', '%', '~', '#', '+']
        for char in special_chars:
            features[f'count_{char}'] = url.count(char)
        
        # Other suspicious patterns
        features['has_ip_address'] = 1 if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url) else 0
        features['has_suspicious_tld'] = 1 if re.search(r'\.(?:xyz|top|club|online|site|fun|loan|work)$', domain.lower()) else 0
        features['has_multiple_dots'] = 1 if '..' in url else 0
        features['has_multiple_subdomains'] = 1 if features['subdomain_count'] > 2 else 0
        
        # Statistical features
        features['digit_ratio'] = sum(c.isdigit() for c in url) / len(url) if url else 0
        features['letter_ratio'] = sum(c.isalpha() for c in url) / len(url) if url else 0
        features['uppercase_ratio'] = sum(c.isupper() for c in url) / len(url) if url else 0
        features['lowercase_ratio'] = sum(c.islower() for c in url) / len(url) if url else 0
        
        # Entropy calculation (randomness measure)
        if url:
            character_counts = Counter(url)
            entropy = 0
            for count in character_counts.values():
                probability = count / len(url)
                entropy -= probability * math.log2(probability)
            features['entropy'] = entropy
        else:
            features['entropy'] = 0
            
        # TLD extraction
        tld = domain.split('.')[-1] if domain and '.' in domain else ""
        features['tld_length'] = len(tld)
        
        # Common TLDs are less suspicious
        common_tlds = ['com', 'org', 'net', 'edu', 'gov', 'int', 'mil', 'io', 'co']
        features['is_common_tld'] = 1 if tld.lower() in common_tlds else 0
        
        # Look for suspicious words
        suspicious_words = ['secure', 'account', 'banking', 'login', 'signin', 'verify', 
                           'paypal', 'password', 'credential', 'confirm', 'update']
        features['suspicious_words_count'] = sum(1 for word in suspicious_words if word in url.lower())
        
        # Count consecutive digits and consecutive letters
        features['max_consecutive_digits'] = max([len(m) for m in re.findall(r'\d+', url)], default=0)
        features['max_consecutive_letters'] = max([len(m) for m in re.findall(r'[a-zA-Z]+', url)], default=0)
        
    except Exception as e:
        print(f"Error extracting features for URL '{url}': {e}")
        
    return features


def predict(url, model, scaler):
    
    if url[-1] == '/':
        url = url[:-1]
    features = extract_url_features(url)
    features_df = pd.DataFrame([features])
    features_scaled = scaler.transform(features_df)
    prob = model.predict_proba(features_scaled)[0]  # Extract probabilities for the given URL
    
    # Format output in dictionary form
    result = {
        'malicious': round(prob[1]*100, 2),
        'benign': round(prob[0]*100, 2)
    }

    return result



if __name__ == '__main__':
    url = 'http://www.pro.ac'
    model = joblib.load(r'D:\Projects\MaliciousUrlDetection\backend\url_classifier_model.joblib')
    scaler = joblib.load(r'D:\Projects\MaliciousUrlDetection\backend\url_classifier_scaler.joblib')
    load_safe_domains()
    import time
    st = time.time()
    print(predict(url, model, scaler))
    print(time.time() - st)