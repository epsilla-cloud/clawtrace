"""Tests for the in-memory consumption store."""

from app.consumption import ConsumptionStore


def test_accept_merges_items():
    store = ConsumptionStore()
    store.accept("t1", {"llm_input_token_1k": 10.0, "tool_call": 3.0})
    store.accept("t1", {"llm_input_token_1k": 5.0, "storage_gb_hour": 1.0})

    result = store.peek("t1")
    assert result["llm_input_token_1k"] == 15.0
    assert result["tool_call"] == 3.0
    assert result["storage_gb_hour"] == 1.0


def test_harvest_all_resets():
    store = ConsumptionStore()
    store.accept("t1", {"a": 1.0})
    store.accept("t2", {"b": 2.0})

    snapshot = store.harvest_all()
    assert "t1" in snapshot
    assert "t2" in snapshot
    assert snapshot["t1"]["a"] == 1.0
    assert snapshot["t2"]["b"] == 2.0

    # After harvest, store should be empty
    assert store.peek("t1") == {}
    assert store.peek("t2") == {}
    assert store.harvest_all() == {}


def test_multiple_tenants_independent():
    store = ConsumptionStore()
    store.accept("t1", {"x": 10.0})
    store.accept("t2", {"x": 20.0})

    assert store.peek("t1")["x"] == 10.0
    assert store.peek("t2")["x"] == 20.0
