from kubernetes import client, config
from app.config import settings

def _get_k8s_client():
    try:
        config.load_incluster_config()
    except:
        config.load_kube_config()
    return client.CoreV1Api(), client.AppsV1Api(), client.NetworkingV1Api()

def deploy_tenant_store(tenant_id: str, subdomain: str):
    core_api, apps_api, net_api = _get_k8s_client()
    namespace = f"tenant-{subdomain}"
    
    # Create Namespace
    ns = client.V1Namespace(metadata=client.V1ObjectMeta(name=namespace))
    core_api.create_namespace(body=ns)
    
    # Create ConfigMap
    cm = client.V1ConfigMap(
        metadata=client.V1ObjectMeta(name="boutique-config", namespace=namespace),
        data={"THEME_COLOR": "#000000"}
    )
    core_api.create_namespaced_config_map(namespace=namespace, body=cm)
    
    # Create Deployment
    container = client.V1Container(
        name="boutique",
        image="ghcr.io/bezbee25/boutique-global:latest",
        ports=[client.V1ContainerPort(container_port=3000)],
        env=[
            client.V1EnvVar(name="WOXXAPP_API_URL", value="http://woxxapp-api.woxxapp.svc.cluster.local:8000"),
            client.V1EnvVar(name="WOXXAPP_TENANT_ID", value=tenant_id),
            client.V1EnvVar(name="NODE_ENV", value="production"),
            client.V1EnvVar(name="PORT", value="3000"),
            client.V1EnvVar(name="DATABASE_URL", value="file:/app/data/boutique.db")
        ]
    )
    template = client.V1PodTemplateSpec(
        metadata=client.V1ObjectMeta(labels={"app": "boutique"}),
        spec=client.V1PodSpec(containers=[container])
    )
    deployment = client.V1Deployment(
        metadata=client.V1ObjectMeta(name="boutique-dep", namespace=namespace),
        spec=client.V1DeploymentSpec(replicas=1, selector=client.V1LabelSelector(match_labels={"app": "boutique"}), template=template)
    )
    apps_api.create_namespaced_deployment(namespace=namespace, body=deployment)
    
    # Create Service
    svc = client.V1Service(
        metadata=client.V1ObjectMeta(name="boutique-svc", namespace=namespace),
        spec=client.V1ServiceSpec(selector={"app": "boutique"}, ports=[client.V1ServicePort(port=80, target_port=3000)])
    )
    core_api.create_namespaced_service(namespace=namespace, body=svc)
    
    # Create Ingress
    host = f"{subdomain}.{settings.SUBDOMAIN_BASE}"
    ingress = client.V1Ingress(
        metadata=client.V1ObjectMeta(
            name="boutique-ingress",
            namespace=namespace,
            annotations={"cert-manager.io/cluster-issuer": "letsencrypt-prod"}
        ),
        spec=client.V1IngressSpec(
            tls=[client.V1IngressTLS(hosts=[host], secret_name=f"{subdomain}-tls")],
            rules=[client.V1IngressRule(
                host=host,
                http=client.V1HTTPIngressRuleValue(
                    paths=[client.V1HTTPIngressPath(
                        path="/",
                        path_type="Prefix",
                        backend=client.V1IngressBackend(
                            service=client.V1IngressServiceBackend(
                                name="boutique-svc",
                                port=client.V1ServiceBackendPort(number=80)
                            )
                        )
                    )]
                )
            )]
        )
    )
    net_api.create_namespaced_ingress(namespace=namespace, body=ingress)

def delete_tenant_store(subdomain: str):
    core_api, _, _ = _get_k8s_client()
    core_api.delete_namespace(name=f"tenant-{subdomain}")
