#!/usr/bin/env bash
pipenv run tensorflowjs_converter --input_format=tf_saved_model --output_format=tfjs_graph_model --saved_model_tags=serve --skip_op_check /Users/allanpichardo/Documents/Dev/music-search/mfcc_spectro_var_encoder /Users/allanpichardo/Documents/Dev/music-search/model
# --output_node_names='z'