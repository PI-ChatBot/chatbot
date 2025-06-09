'''
Script parar criar um banco de dados vetorial a partir do dataframe com os produtos cadastrados no banco de dados.
'''

import os
from time import sleep

import dotenv
import numpy as np
import openai
import pandas as pd
import pinecone
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer

# Carregar variáveis de ambiente