import numpy as np
from typing import Dict, Any, List
from app.nlp_engine import nlp_engine
from app.dataset_manager import dataset_manager

class ModelEvaluator:
    def evaluate_benchmark(self, threshold: float = 0.35) -> Dict[str, Any]:
        """Run benchmark evaluation against ground truth dataset to calculate classification metrics."""
        benchmark_items = dataset_manager.load_benchmark()
        if not benchmark_items:
            return {
                "error": "No benchmark items found in data/eval_benchmark.json"
            }
            
        y_true = []
        y_pred = []
        scores = []
        detailed_results = []
        
        tp, fp, tn, fn = 0, 0, 0, 0
        
        for item in benchmark_items:
            q_title = item.get("query_title", "")
            q_abstract = item.get("query_abstract", "")
            c_title = item.get("candidate_title", "")
            c_abstract = item.get("candidate_abstract", "")
            actual_label = item.get("ground_truth_label", 0)
            
            # Compute similarity using NLP engine
            lexical_sim = nlp_engine.compute_lexical_similarity(q_abstract, c_abstract)
            semantic_sim = nlp_engine.compute_semantic_similarity(q_abstract, c_abstract)
            title_sim = nlp_engine.compute_lexical_similarity(q_title, c_title)
            
            hybrid_score = (0.45 * semantic_sim + 0.35 * lexical_sim + 0.20 * title_sim)
            predicted_label = 1 if hybrid_score >= threshold else 0
            
            y_true.append(actual_label)
            y_pred.append(predicted_label)
            scores.append(round(hybrid_score * 100, 2))
            
            if actual_label == 1 and predicted_label == 1:
                tp += 1
                result_status = "True Positive"
            elif actual_label == 0 and predicted_label == 1:
                fp += 1
                result_status = "False Positive"
            elif actual_label == 0 and predicted_label == 0:
                tn += 1
                result_status = "True Negative"
            else:
                fn += 1
                result_status = "False Negative"
                
            detailed_results.append({
                "id": item.get("id"),
                "query_title": q_title,
                "candidate_title": c_title,
                "ground_truth": "Duplicate (1)" if actual_label == 1 else "Non-Duplicate (0)",
                "predicted": "Duplicate (1)" if predicted_label == 1 else "Non-Duplicate (0)",
                "calculated_similarity": round(hybrid_score * 100, 2),
                "classification_result": result_status,
                "category": item.get("category", "General")
            })

        total = len(y_true)
        accuracy = (tp + tn) / total if total > 0 else 0.0
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1_score = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

        # Run threshold optimization scan across thresholds 0.30 to 0.80
        threshold_scan = []
        for t in np.arange(0.30, 0.85, 0.05):
            t_val = float(round(t, 2))
            t_pred = [1 if (s / 100.0) >= t_val else 0 for s in scores]
            t_tp = sum(1 for yt, yp in zip(y_true, t_pred) if yt == 1 and yp == 1)
            t_fp = sum(1 for yt, yp in zip(y_true, t_pred) if yt == 0 and yp == 1)
            t_fn = sum(1 for yt, yp in zip(y_true, t_pred) if yt == 1 and yp == 0)
            
            t_prec = t_tp / (t_tp + t_fp) if (t_tp + t_fp) > 0 else 0
            t_rec = t_tp / (t_tp + t_fn) if (t_tp + t_fn) > 0 else 0
            t_f1 = (2 * t_prec * t_rec) / (t_prec + t_rec) if (t_prec + t_rec) > 0 else 0
            
            threshold_scan.append({
                "threshold": int(t_val * 100),
                "precision": round(t_prec * 100, 1),
                "recall": round(t_rec * 100, 1),
                "f1_score": round(t_f1 * 100, 1)
            })

        return {
            "evaluation_metrics": {
                "accuracy": round(accuracy * 100, 2),
                "precision": round(precision * 100, 2),
                "recall": round(recall * 100, 2),
                "f1_score": round(f1_score * 100, 2),
                "total_samples": total,
                "applied_threshold": int(threshold * 100)
            },
            "confusion_matrix": {
                "true_positives": tp,
                "false_positives": fp,
                "true_negatives": tn,
                "false_negatives": fn
            },
            "threshold_analysis": threshold_scan,
            "detailed_benchmark": detailed_results
        }

model_evaluator = ModelEvaluator()
