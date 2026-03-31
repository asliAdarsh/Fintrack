import multiprocessing
import os

bind = "0.0.0.0:5000"

workers = multiprocessing.cpu_count() * 2 + 1
threads = 4
worker_class = "gthread"

timeout = 120
keepalive = 2

accesslog = "-"
errorlog = "-"
loglevel = "info"

preload_app = True

max_requests = 1000
max_requests_jitter = 50
