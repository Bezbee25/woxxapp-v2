def get_entitlements(tenant_id: str):
    pass

def check_dependency_tree(module_slug: str):
    deps = {
        "payment": "ecommerce",
        "shipping": "ecommerce",
        "food_delivery": "vitrine",
        "custom_domain": "vitrine"
    }
    return deps.get(module_slug)

def activate_module(tenant_id: str, module_slug: str):
    pass
